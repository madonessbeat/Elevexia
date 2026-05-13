export interface SurveyResponse {
	questionId: string;
	value: string;
	answeredAt: number;
}

export interface QuizResponse {
	itemId: string;
	dokLevel: 1 | 2 | 3 | 4;
	answer: string;
	isCorrect: boolean;
	responseTimeMs: number;
	attemptCount: number;
	skipped: boolean;
}

export interface EvidenceItem {
	source: 'survey' | 'quiz' | 'derived';
	detail: string;
	timestamp: number;
}

export interface Flag {
	value: boolean;
	confidence: 'low' | 'medium' | 'high';
	evidence: EvidenceItem[];
}

export interface FlagSet {
	reading_accessibility: Flag;
	attention_chunking: Flag;
	language_scaffolding: Flag;
	hands_on_learning: Flag;
	extended_challenge: Flag;
}

export interface Student {
	id: string;
	firstName: string;
	lastInitial: string;
	yearGroup: 4 | 5 | 6;
	flags: FlagSet | null;
	validatedByTeacher: boolean;
}
