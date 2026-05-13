import type { Student, Flag, FlagSet } from '$lib/types';

const DAY = 86_400_000;
const ts = (daysAgo: number) => Date.now() - daysAgo * DAY;

const FALSE_FLAG: Flag = { value: false, confidence: 'low', evidence: [] };

// Student A — Marcus T.: high-achiever, extended_challenge only
const studentA: Student = {
	id: 'stu-a',
	firstName: 'Marcus',
	lastInitial: 'T',
	yearGroup: 5,
	validatedByTeacher: false,
	flags: {
		reading_accessibility: FALSE_FLAG,
		attention_chunking: FALSE_FLAG,
		language_scaffolding: FALSE_FLAG,
		hands_on_learning: FALSE_FLAG,
		extended_challenge: {
			value: true,
			confidence: 'high',
			evidence: [
				{
					source: 'quiz',
					detail: 'Accuracy on DOK 3–4 items: 90% (9/10)',
					timestamp: ts(1)
				},
				{
					source: 'quiz',
					detail: 'Overall quiz accuracy: 100% (10/10)',
					timestamp: ts(1)
				},
				{
					source: 'survey',
					detail: "Reported 'easy' on survey question difficulty_self",
					timestamp: ts(2)
				}
			]
		}
	} satisfies FlagSet
};

// Student B — Amara D.: EAL learner, reading_accessibility + language_scaffolding
const studentB: Student = {
	id: 'stu-b',
	firstName: 'Amara',
	lastInitial: 'D',
	yearGroup: 5,
	validatedByTeacher: false,
	flags: {
		reading_accessibility: {
			value: true,
			confidence: 'medium',
			evidence: [
				{
					source: 'survey',
					detail: "Reported 'hard' on survey question reading_exp",
					timestamp: ts(3)
				},
				{
					source: 'quiz',
					detail: 'Average response time on DOK 2+ items (3 200 ms) is 2.10× the overall median (1 524 ms)',
					timestamp: ts(3)
				}
			]
		},
		attention_chunking: FALSE_FLAG,
		language_scaffolding: {
			value: true,
			confidence: 'high',
			evidence: [
				{
					source: 'survey',
					detail: "Reported 'mostly_other' on survey question home_language",
					timestamp: ts(3)
				},
				{
					source: 'survey',
					detail: "Reported 'learning' on survey question language_confidence",
					timestamp: ts(3)
				},
				{
					source: 'survey',
					detail: "Reported 'gives_up' on survey question persistence",
					timestamp: ts(3)
				}
			]
		},
		hands_on_learning: FALSE_FLAG,
		extended_challenge: FALSE_FLAG
	} satisfies FlagSet
};

// Student C — Jake P.: kinaesthetic / low attention stamina
const studentC: Student = {
	id: 'stu-c',
	firstName: 'Jake',
	lastInitial: 'P',
	yearGroup: 4,
	validatedByTeacher: false,
	flags: {
		reading_accessibility: FALSE_FLAG,
		attention_chunking: {
			value: true,
			confidence: 'medium',
			evidence: [
				{
					source: 'quiz',
					detail: 'Accuracy dropped from 80% in first half to 40% in second half (decay 40%)',
					timestamp: ts(2)
				},
				{
					source: 'survey',
					detail: "Reported 'hard' on survey question focus_duration",
					timestamp: ts(2)
				}
			]
		},
		language_scaffolding: FALSE_FLAG,
		hands_on_learning: {
			value: true,
			confidence: 'high',
			evidence: [
				{
					source: 'survey',
					detail: "Reported 'try' on survey question learning_pref",
					timestamp: ts(2)
				},
				{
					source: 'survey',
					detail: "Reported 'hands_on' on survey question preferred_format",
					timestamp: ts(2)
				},
				{
					source: 'survey',
					detail: "Reported 'tries_first' on survey question help_seeking",
					timestamp: ts(2)
				}
			]
		},
		extended_challenge: FALSE_FLAG
	} satisfies FlagSet
};

// Student D — Sophie L.: mild reading difficulty
const studentD: Student = {
	id: 'stu-d',
	firstName: 'Sophie',
	lastInitial: 'L',
	yearGroup: 5,
	validatedByTeacher: false,
	flags: {
		reading_accessibility: {
			value: true,
			confidence: 'medium',
			evidence: [
				{
					source: 'survey',
					detail: "Reported 'slow' on survey question reading_exp",
					timestamp: ts(4)
				}
			]
		},
		attention_chunking: FALSE_FLAG,
		language_scaffolding: FALSE_FLAG,
		hands_on_learning: FALSE_FLAG,
		extended_challenge: FALSE_FLAG
	} satisfies FlagSet
};

// Student E — Noah W.: typically progressing, teacher-validated
const studentE: Student = {
	id: 'stu-e',
	firstName: 'Noah',
	lastInitial: 'W',
	yearGroup: 4,
	validatedByTeacher: true,
	flags: {
		reading_accessibility: FALSE_FLAG,
		attention_chunking: FALSE_FLAG,
		language_scaffolding: FALSE_FLAG,
		hands_on_learning: FALSE_FLAG,
		extended_challenge: FALSE_FLAG
	} satisfies FlagSet
};

export const SEED_STUDENTS: Student[] = [studentA, studentB, studentC, studentD, studentE];
