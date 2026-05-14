import { writable } from 'svelte/store';
import type { ParentChild, FlagSet } from '$lib/types';

const DAY = 86_400_000;
const FALSE_FLAG = { value: false, confidence: 'low' as const, evidence: [] };

const amaraFlags: FlagSet = {
	reading_accessibility: {
		value: true,
		confidence: 'medium',
		evidence: [
			{ source: 'survey', detail: 'Responded "hard" to reading experience question', timestamp: Date.now() - 3 * DAY }
		]
	},
	attention_chunking: FALSE_FLAG,
	language_scaffolding: {
		value: true,
		confidence: 'high',
		evidence: [
			{ source: 'survey', detail: 'Home language survey indicates EAL context', timestamp: Date.now() - 3 * DAY }
		]
	},
	hands_on_learning: FALSE_FLAG,
	extended_challenge: FALSE_FLAG
};

const noahFlags: FlagSet = {
	reading_accessibility: FALSE_FLAG,
	attention_chunking: FALSE_FLAG,
	language_scaffolding: FALSE_FLAG,
	hands_on_learning: FALSE_FLAG,
	extended_challenge: FALSE_FLAG
};

const SEED_CHILDREN: ParentChild[] = [
	{
		id: 'child-1',
		anonymizedLabel: 'Your child · Year 5',
		yearGroup: 5,
		flags: amaraFlags,
		assessmentDate: Date.now() - 3 * DAY,
		progressTimeline: [
			{ date: Date.now() - 3 * DAY, type: 'assessment_completed', label: 'Assessment completed' },
			{ date: Date.now() - 2 * DAY, type: 'flag_confirmed', label: 'Learning profile confirmed by teacher' },
			{ date: Date.now() - 1 * DAY, type: 'material_generated', label: 'Adapted lesson material generated' }
		]
	},
	{
		id: 'child-2',
		anonymizedLabel: 'Your child · Year 4',
		yearGroup: 4,
		flags: noahFlags,
		assessmentDate: Date.now() - 5 * DAY,
		progressTimeline: [
			{ date: Date.now() - 5 * DAY, type: 'assessment_completed', label: 'Assessment completed' },
			{ date: Date.now() - 4 * DAY, type: 'flag_confirmed', label: 'Learning profile confirmed by teacher' }
		]
	}
];

interface ParentState {
	children: ParentChild[];
}

function createParentStore() {
	const { subscribe } = writable<ParentState>({ children: SEED_CHILDREN });
	return { subscribe };
}

export const parentStore = createParentStore();
