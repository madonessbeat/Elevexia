import type { TDocumentDefinitions, StyleDictionary } from 'pdfmake/interfaces';
import type { Student, FlagSet } from '$lib/types';
import { createRequire } from 'module';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PdfPrinterCtor = new (fonts: object, vfs?: unknown, urlResolver?: unknown, localAccess?: unknown) => { createPdfKitDocument(def: TDocumentDefinitions): Promise<any> };

export interface WorksheetQuestion {
	stem: string;
	type: 'mcq' | 'short' | 'extended';
	options?: string[];
}

export interface WorksheetSection {
	heading: string;
	instruction: string;
	checkpoint?: string;
	questions: WorksheetQuestion[];
}

export interface WorksheetData {
	title: string;
	intro: string;
	sections: WorksheetSection[];
	glossary?: { term: string; definition: string }[];
	stretch?: WorksheetQuestion[];
}

// Standard PDF Type-1 fonts — no file paths needed; PDFKit resolves them natively
const FONTS = {
	Helvetica: {
		normal: 'Helvetica',
		bold: 'Helvetica-Bold',
		italics: 'Helvetica-Oblique',
		bolditalics: 'Helvetica-BoldOblique'
	}
};

function hasFlag(flags: FlagSet | null, key: keyof FlagSet): boolean {
	return flags?.[key]?.value === true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function questionBlock(q: WorksheetQuestion, large: boolean): any {
	const fs = large ? 13 : 11;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const items: any[] = [{ text: q.stem, fontSize: fs, marginBottom: 4 }];

	if (q.type === 'mcq' && q.options) {
		items.push({ ol: q.options, fontSize: fs - 1, marginLeft: 8, marginBottom: 2 });
	} else if (q.type === 'short') {
		items.push({
			canvas: [{ type: 'line', x1: 0, y1: 0, x2: 440, y2: 0, lineWidth: 0.5, lineColor: '#cccccc' }],
			marginTop: 6,
			marginBottom: 12
		});
	} else {
		for (let i = 0; i < 3; i++) {
			items.push({
				canvas: [{ type: 'line', x1: 0, y1: 0, x2: 440, y2: 0, lineWidth: 0.5, lineColor: '#cccccc' }],
				marginTop: 6
			});
		}
		items.push({ text: '', marginBottom: 8 });
	}

	return { stack: items, marginBottom: 10 };
}

export async function renderWorksheet(
	data: WorksheetData,
	student: Student,
	flags: FlagSet | null
): Promise<Buffer> {
	// Lazy-load at call time so any CJS resolution failure is caught by the
	// route handler's try/catch rather than crashing the module at cold-start
	const _require = createRequire(import.meta.url);
	const PdfPrinter = _require('pdfmake/js/Printer.js').default as PdfPrinterCtor;

	const readingA11y = hasFlag(flags, 'reading_accessibility');
	const chunking = hasFlag(flags, 'attention_chunking');
	const scaffolding = hasFlag(flags, 'language_scaffolding');
	const handsOn = hasFlag(flags, 'hands_on_learning');
	const stretch = hasFlag(flags, 'extended_challenge');

	const pageBg = readingA11y ? '#FAFAF5' : '#FFFFFF';
	const bodySize = readingA11y ? 12 : 11;
	const lh = readingA11y ? 1.5 : 1.3;

	const styles: StyleDictionary = {
		title: { fontSize: 18, bold: true, color: '#3730A3', marginBottom: 4 },
		sub: { fontSize: 10, color: '#6B7280' },
		intro: { fontSize: bodySize, lineHeight: lh, marginBottom: 16, color: '#374151' },
		sHead: { fontSize: 13, bold: true, color: '#1F2937', marginBottom: 4, marginTop: 16 },
		sNote: { fontSize: bodySize - 1, color: '#6B7280', marginBottom: 8 },
		checkpoint: { fontSize: 11, color: '#7C3AED', marginBottom: 10, marginTop: 2 },
		glossTitle: { fontSize: 11, bold: true, marginTop: 16, marginBottom: 4 },
		glossEntry: { fontSize: 10, color: '#374151' },
		stretchTitle: { fontSize: 13, bold: true, color: '#B45309', marginTop: 20, marginBottom: 4 },
		foot: { fontSize: 9, color: '#9CA3AF' }
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const content: any[] = [];

	// Header
	content.push({
		columns: [
			{
				stack: [
					{ text: data.title, style: 'title' },
					{ text: `${student.firstName} ${student.lastInitial}. · Year ${student.yearGroup} · Maths`, style: 'sub' }
				]
			},
			{ text: 'Elevexia', alignment: 'right', fontSize: 10, bold: true, color: '#3730A3', margin: [0, 4, 0, 0] }
		],
		marginBottom: 10
	});
	content.push({
		canvas: [{ type: 'line', x1: 0, y1: 0, x2: 440, y2: 0, lineWidth: 1, lineColor: '#3730A3' }],
		marginBottom: 12
	});

	content.push({ text: data.intro, style: 'intro' });

	for (const section of data.sections) {
		content.push({ text: section.heading, style: 'sHead' });
		content.push({ text: section.instruction, style: 'sNote' });
		for (const q of section.questions) content.push(questionBlock(q, readingA11y));
		if (chunking && section.checkpoint) {
			content.push({ text: section.checkpoint, style: 'checkpoint' });
		}
		if (handsOn) {
			content.push({
				text: 'Try this with objects: use counters, cubes, or drawings to work out the answers above.',
				fontSize: 10, color: '#065F46', italics: true, marginBottom: 8, marginTop: 4
			});
		}
	}

	if (scaffolding && data.glossary?.length) {
		content.push({ text: 'Word Key', style: 'glossTitle' });
		content.push({
			table: {
				widths: [110, '*'],
				body: [
					[{ text: 'Word', bold: true, fontSize: 10 }, { text: 'Meaning', bold: true, fontSize: 10 }],
					...data.glossary.map((g) => [
						{ text: g.term, style: 'glossEntry' },
						{ text: g.definition, style: 'glossEntry' }
					])
				]
			},
			layout: 'lightHorizontalLines',
			marginBottom: 8
		});
	}

	if (stretch && data.stretch?.length) {
		content.push({ text: 'Stretch Challenge', style: 'stretchTitle' });
		for (const q of data.stretch) content.push(questionBlock(q, readingA11y));
	}

	const docDef: TDocumentDefinitions = {
		pageSize: 'A4',
		pageMargins: [50, 60, 50, 60],
		background: (_page: number, pageSize: { width: number; height: number }) => ({
			canvas: [{ type: 'rect', x: 0, y: 0, w: pageSize.width, h: pageSize.height, color: pageBg }]
		}),
		defaultStyle: { font: 'Helvetica', fontSize: bodySize, lineHeight: lh },
		styles,
		content,
		footer: (currentPage: number, pageCount: number) => ({
			columns: [
				{ text: `Adapted worksheet · ${data.title}`, style: 'foot' },
				{ text: `${currentPage} / ${pageCount}`, style: 'foot', alignment: 'right' }
			],
			margin: [50, 0]
		})
	};

	// Pass a no-op urlResolver — pdfmake calls resolve() per URL then awaits resolved()
	const printer = new PdfPrinter(FONTS, undefined, { resolve: () => {}, resolved: async () => {} }, undefined);
	const doc = await printer.createPdfKitDocument(docDef);

	return new Promise<Buffer>((resolve, reject) => {
		const chunks: Buffer[] = [];
		doc.on('data', (chunk: Buffer) => chunks.push(chunk));
		doc.on('end', () => resolve(Buffer.concat(chunks)));
		doc.on('error', reject);
		doc.end();
	});
}
