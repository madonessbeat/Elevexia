import type { SurveyResponse, QuizResponse, EvidenceItem, Flag, FlagSet } from '$lib/types';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface EngineInput {
	surveyResponses: SurveyResponse[];
	quizResponses: QuizResponse[];
	/** Caller-supplied timestamp used as evidence `timestamp` — keeps engine pure. */
	now: number;
}

export function evaluate(input: EngineInput): FlagSet {
	const survey = indexSurvey(input.surveyResponses);
	const quiz = input.quizResponses;

	return {
		reading_accessibility: evalReadingAccessibility(survey, quiz, input.now),
		attention_chunking: evalAttentionChunking(survey, quiz, input.now),
		language_scaffolding: evalLanguageScaffolding(survey, input.now),
		hands_on_learning: evalHandsOnLearning(survey, input.now),
		extended_challenge: evalExtendedChallenge(
			quiz,
			evalAttentionChunking(survey, quiz, input.now).value,
			input.now
		)
	};
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

type SurveyIndex = Map<string, string>;

function indexSurvey(responses: SurveyResponse[]): SurveyIndex {
	return new Map(responses.map((r) => [r.questionId, r.value]));
}

function makeFlag(
	value: boolean,
	confidence: Flag['confidence'],
	evidence: EvidenceItem[]
): Flag {
	return { value, confidence, evidence };
}

function surveyEvidence(
	questionId: string,
	value: string,
	now: number
): EvidenceItem {
	return {
		source: 'survey',
		detail: `Reported '${value}' on survey question ${questionId}`,
		timestamp: now
	};
}

function quizEvidence(detail: string, now: number): EvidenceItem {
	return { source: 'quiz', detail, timestamp: now };
}

function median(values: number[]): number {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 === 0
		? (sorted[mid - 1] + sorted[mid]) / 2
		: sorted[mid];
}

function accuracy(items: QuizResponse[]): number {
	if (items.length === 0) return 0;
	return items.filter((r) => r.isCorrect).length / items.length;
}

// ---------------------------------------------------------------------------
// Rule 1 — reading_accessibility
// ---------------------------------------------------------------------------

function evalReadingAccessibility(
	survey: SurveyIndex,
	quiz: QuizResponse[],
	now: number
): Flag {
	const evidence: EvidenceItem[] = [];

	// Signal A: self-reported reading difficulty
	const readingExp = survey.get('reading_exp');
	const slowValues = new Set(['slow', 'hard', 'jump_around']);
	const hasReadingSignal = readingExp !== undefined && slowValues.has(readingExp);
	if (hasReadingSignal) {
		evidence.push(surveyEvidence('reading_exp', readingExp!, now));
	}

	// Signal B: response-time on text-heavy (DOK 2+) items vs median across all
	const textHeavy = quiz.filter((r) => r.dokLevel >= 2);
	const allTimes = quiz.map((r) => r.responseTimeMs);
	const med = median(allTimes);
	const avgTextHeavy =
		textHeavy.length > 0
			? textHeavy.reduce((s, r) => s + r.responseTimeMs, 0) / textHeavy.length
			: 0;
	const hasTimeSignal = med > 0 && textHeavy.length > 0 && avgTextHeavy > 1.5 * med;
	if (hasTimeSignal) {
		const ratio = (avgTextHeavy / med).toFixed(2);
		evidence.push(
			quizEvidence(
				`Average response time on DOK 2+ items (${Math.round(avgTextHeavy)}ms) is ${ratio}× the overall median (${Math.round(med)}ms)`,
				now
			)
		);
	}

	const signalCount = (hasReadingSignal ? 1 : 0) + (hasTimeSignal ? 1 : 0);

	if (signalCount === 0) return makeFlag(false, 'low', []);

	// Confidence: strong time signal (ratio > 2×) or both signals → high; one strong signal → medium; one weak → low
	const ratio = med > 0 ? avgTextHeavy / med : 0;
	let confidence: Flag['confidence'];
	if (signalCount >= 2) {
		confidence = 'high';
	} else if (hasTimeSignal && ratio > 2.0) {
		confidence = 'medium';
	} else if (hasReadingSignal) {
		confidence = 'medium'; // self-report is a direct strong signal
	} else {
		confidence = 'low';
	}

	return makeFlag(true, confidence, evidence);
}

// ---------------------------------------------------------------------------
// Rule 2 — attention_chunking
// ---------------------------------------------------------------------------

function evalAttentionChunking(
	survey: SurveyIndex,
	quiz: QuizResponse[],
	now: number
): Flag {
	const evidence: EvidenceItem[] = [];

	// Signal A: accuracy decay between halves
	const mid = Math.floor(quiz.length / 2);
	const firstHalf = quiz.slice(0, mid);
	const secondHalf = quiz.slice(mid);
	const firstAcc = accuracy(firstHalf);
	const secondAcc = accuracy(secondHalf);
	const decay = firstHalf.length > 0 && secondHalf.length > 0 ? firstAcc - secondAcc : 0;
	const hasDecaySignal = decay > 0.25;
	if (hasDecaySignal) {
		const pct = (v: number) => `${Math.round(v * 100)}%`;
		evidence.push(
			quizEvidence(
				`Accuracy dropped from ${pct(firstAcc)} in first half to ${pct(secondAcc)} in second half of quiz (decay ${pct(decay)})`,
				now
			)
		);
	}

	// Signal B: self-reported focus difficulty
	const focusDuration = survey.get('focus_duration');
	const focusValues = new Set(['hard', 'distracted']);
	const hasFocusSignal = focusDuration !== undefined && focusValues.has(focusDuration);
	if (hasFocusSignal) {
		evidence.push(surveyEvidence('focus_duration', focusDuration!, now));
	}

	// Signal C: self-reported attention difficulty
	const attentionSelf = survey.get('attention_self');
	const attentionValues = new Set(['hard', 'distracted', 'often_loses_focus']);
	const hasAttentionSignal = attentionSelf !== undefined && attentionValues.has(attentionSelf);
	if (hasAttentionSignal) {
		evidence.push(surveyEvidence('attention_self', attentionSelf!, now));
	}

	const signalCount =
		(hasDecaySignal ? 1 : 0) + (hasFocusSignal ? 1 : 0) + (hasAttentionSignal ? 1 : 0);

	if (signalCount === 0) return makeFlag(false, 'low', []);

	let confidence: Flag['confidence'];
	if (signalCount >= 3) {
		confidence = 'high';
	} else if (signalCount === 2 || (hasDecaySignal && decay > 0.35)) {
		confidence = 'medium';
	} else {
		confidence = 'low';
	}

	return makeFlag(true, confidence, evidence);
}

// ---------------------------------------------------------------------------
// Rule 3 — language_scaffolding
// ---------------------------------------------------------------------------

function evalLanguageScaffolding(survey: SurveyIndex, now: number): Flag {
	const evidence: EvidenceItem[] = [];

	const homeLanguage = survey.get('home_language');
	const langConfidence = survey.get('language_confidence');

	const isNonEnglish = homeLanguage !== undefined && homeLanguage !== 'english';
	const lowConfidenceValues = new Set(['learning', 'sometimes']);
	const hasLowConfidence =
		langConfidence !== undefined && lowConfidenceValues.has(langConfidence);

	// Both conditions are REQUIRED (AND rule)
	if (!isNonEnglish || !hasLowConfidence) return makeFlag(false, 'low', []);

	evidence.push(surveyEvidence('home_language', homeLanguage!, now));
	evidence.push(surveyEvidence('language_confidence', langConfidence!, now));

	// Two required corroborating signals — always medium; add 3rd via persistence if present
	const persistence = survey.get('persistence');
	const hasStruggleSignal = persistence !== undefined && persistence === 'gives_up';
	if (hasStruggleSignal) {
		evidence.push(surveyEvidence('persistence', persistence!, now));
	}

	const confidence: Flag['confidence'] = hasStruggleSignal ? 'high' : 'medium';
	return makeFlag(true, confidence, evidence);
}

// ---------------------------------------------------------------------------
// Rule 4 — hands_on_learning
// ---------------------------------------------------------------------------

function evalHandsOnLearning(survey: SurveyIndex, now: number): Flag {
	const evidence: EvidenceItem[] = [];

	const learningPref = survey.get('learning_pref');
	const handsOnValues = new Set(['try', 'see']);
	const hasPrefSignal = learningPref !== undefined && handsOnValues.has(learningPref);
	if (hasPrefSignal) {
		evidence.push(surveyEvidence('learning_pref', learningPref!, now));
	}

	// Corroborating signal: preferred_format
	const preferredFormat = survey.get('preferred_format');
	const formatValues = new Set(['hands_on', 'visual', 'practical']);
	const hasFormatSignal = preferredFormat !== undefined && formatValues.has(preferredFormat);
	if (hasFormatSignal) {
		evidence.push(surveyEvidence('preferred_format', preferredFormat!, now));
	}

	// Second corroborating signal: help_seeking style
	const helpSeeking = survey.get('help_seeking');
	const helpValues = new Set(['tries_first', 'experiments']);
	const hasHelpSignal = helpSeeking !== undefined && helpValues.has(helpSeeking);
	if (hasHelpSignal) {
		evidence.push(surveyEvidence('help_seeking', helpSeeking!, now));
	}

	if (!hasPrefSignal) return makeFlag(false, 'low', []);

	const signalCount =
		(hasPrefSignal ? 1 : 0) + (hasFormatSignal ? 1 : 0) + (hasHelpSignal ? 1 : 0);

	let confidence: Flag['confidence'];
	if (signalCount >= 3) {
		confidence = 'high';
	} else if (signalCount === 2) {
		confidence = 'medium';
	} else {
		confidence = 'low';
	}

	return makeFlag(true, confidence, evidence);
}

// ---------------------------------------------------------------------------
// Rule 5 — extended_challenge
// ---------------------------------------------------------------------------

function evalExtendedChallenge(
	quiz: QuizResponse[],
	attentionChunkingActive: boolean,
	now: number
): Flag {
	// Hard gate: attention_chunking must be false
	if (attentionChunkingActive) return makeFlag(false, 'low', []);

	const evidence: EvidenceItem[] = [];

	const dok34 = quiz.filter((r) => r.dokLevel >= 3);
	const dok34Acc = accuracy(dok34);
	const overallAcc = accuracy(quiz);

	const meetsThreshold = dok34.length > 0 && dok34Acc >= 0.7 && overallAcc >= 0.8;
	if (!meetsThreshold) return makeFlag(false, 'low', []);

	evidence.push(
		quizEvidence(
			`Accuracy on DOK 3–4 items: ${Math.round(dok34Acc * 100)}% (${dok34.filter((r) => r.isCorrect).length}/${dok34.length})`,
			now
		)
	);
	evidence.push(
		quizEvidence(
			`Overall quiz accuracy: ${Math.round(overallAcc * 100)}% (${quiz.filter((r) => r.isCorrect).length}/${quiz.length})`,
			now
		)
	);

	// Corroborating: difficulty_self
	// (survey not passed here — confidence derived from quiz margins)
	const dok34Margin = dok34Acc - 0.7;
	const overallMargin = overallAcc - 0.8;

	let confidence: Flag['confidence'];
	if (dok34Margin >= 0.2 && overallMargin >= 0.1) {
		confidence = 'high';
	} else if (dok34Margin >= 0.1 || overallMargin >= 0.1) {
		confidence = 'medium';
	} else {
		confidence = 'low';
	}

	return makeFlag(true, confidence, evidence);
}
