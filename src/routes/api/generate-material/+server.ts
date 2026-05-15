import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Allow up to 60 s on Vercel Pro (Hobby plan hard-caps at 10 s regardless)
export const config = { maxDuration: 60 };
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$env/dynamic/private';
import type { FlagSet, Student } from '$lib/types';
import { renderWorksheet } from '$lib/pdf/render';
import type { WorksheetData } from '$lib/pdf/render';

const FLAG_ADAPTATION_MAP: Record<keyof FlagSet, string> = {
	reading_accessibility:
		'Use short sentences (max 12 words), simple vocabulary, and avoid jargon. Add a word key for any specialist terms.',
	attention_chunking:
		'Break the worksheet into exactly 3 sections of 4 questions each. Start each section with a short encouraging checkpoint message (one sentence).',
	language_scaffolding:
		'Include a visual key (simple diagrams described as text) and a 1-line glossary entry for any maths term used.',
	hands_on_learning:
		'After each section add a "Try this with objects" tip describing a physical manipulative the student can use.',
	extended_challenge:
		'Append a "stretch" array with exactly 2 questions at DOK level 3–4 that push beyond the main topic.'
};

const SYSTEM_INSTRUCTION = `You are an expert primary-school maths teacher creating differentiated worksheets for Year 5 students (age 9–10). You always return valid JSON and nothing else — no markdown, no prose, no code fences.`;

function buildPrompt(topic: string, activeFlags: (keyof FlagSet)[]): string {
	const adaptations =
		activeFlags.length > 0
			? activeFlags.map((f) => `- ${FLAG_ADAPTATION_MAP[f]}`).join('\n')
			: '- No specific adaptations required; write at standard Year 5 level.';

	return `Generate a Year 5 Maths worksheet on the topic: "${topic}".

Required adaptations for this student:
${adaptations}

Return ONLY a JSON object with this exact shape:
{
  "title": "string",
  "intro": "string — 1-2 sentences for the student",
  "sections": [
    {
      "heading": "string",
      "instruction": "string — brief instruction for this section",
      "checkpoint": "string — short encouragement (omit if attention_chunking is not active)",
      "questions": [
        {
          "stem": "string",
          "type": "mcq" | "short" | "extended",
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."]
        }
      ]
    }
  ],
  "glossary": [{ "term": "string", "definition": "string" }],
  "stretch": [{ "stem": "string", "type": "extended" }]
}

Rules:
- Each section should have 4 questions
- Only include "glossary" when language_scaffolding is active
- Only include "stretch" when extended_challenge is active
- Only include "checkpoint" in sections when attention_chunking is active
- Mix question types (mcq and short) for variety`;
}

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => null);
	if (!body || typeof body.topic !== 'string' || !body.topic.trim()) {
		throw error(400, 'Missing topic');
	}

	const topic: string = body.topic.trim();
	const activeFlags: (keyof FlagSet)[] = Array.isArray(body.activeFlags) ? body.activeFlags : [];
	const student: Student | undefined = body.student;
	if (!student) throw error(400, 'Missing student');

	const apiKey = env.GEMINI_API_KEY;
	if (!apiKey) throw error(500, 'GEMINI_API_KEY is not configured on this server. Add it to your Vercel environment variables.');

	const genAI = new GoogleGenerativeAI(apiKey);
	const model = genAI.getGenerativeModel({
		model: 'gemini-2.5-flash-lite',
		systemInstruction: SYSTEM_INSTRUCTION,
		generationConfig: { maxOutputTokens: 1200, temperature: 0.7 }
	});

	let rawText: string;
	try {
		const result = await model.generateContent(buildPrompt(topic, activeFlags));
		rawText = result.response.text();
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		throw error(502, `Gemini API error: ${msg}`);
	}

	const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();

	let worksheet: WorksheetData;
	try {
		worksheet = JSON.parse(cleaned) as WorksheetData;
	} catch {
		throw error(502, 'Model returned invalid JSON');
	}

	let pdfBuffer: Buffer;
	try {
		pdfBuffer = await renderWorksheet(worksheet, student, student.flags ?? null);
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		throw error(500, `PDF render error: ${msg}`);
	}

	return new Response(new Uint8Array(pdfBuffer), {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `inline; filename="worksheet-${student.firstName.toLowerCase()}-${topic.replace(/\s+/g, '-')}.pdf"`,
			'Content-Length': String(pdfBuffer.byteLength)
		}
	});
};
