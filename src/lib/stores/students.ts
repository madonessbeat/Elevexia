import { writable } from 'svelte/store';
import { SEED_STUDENTS } from '$lib/data/seed';
import type { Student, FlagSet, FeatureToggles, LessonPlan } from '$lib/types';

export const FLAG_KEYS: (keyof FlagSet)[] = [
	'reading_accessibility',
	'attention_chunking',
	'language_scaffolding',
	'hands_on_learning',
	'extended_challenge'
];

export interface StudentsState {
	students: Student[];
	overriddenFlags: Record<string, string[]>;
	confirmedFlags: Record<string, string[]>;
	featureToggles: FeatureToggles;
	lessonPlans: LessonPlan[];
}

const DEFAULT_TOGGLES: FeatureToggles = {
	anonymizedStudents: true,
	lessonPlanGeneration: true,
	differentiatedMaterials: true
};

function deepCloneStudents(): Student[] {
	return JSON.parse(JSON.stringify(SEED_STUDENTS));
}

function randomCode(): string {
	return Math.random().toString(36).toUpperCase().slice(2, 8);
}

/** Seed flag profiles used when simulating diagnostic completion */
const DEMO_FLAG_SETS: FlagSet[] = SEED_STUDENTS
	.map((s) => s.flags)
	.filter((f): f is FlagSet => f !== null);

function createStudentsStore() {
	const { subscribe, update } = writable<StudentsState>({
		students: deepCloneStudents(),
		overriddenFlags: {},
		confirmedFlags: {},
		featureToggles: { ...DEFAULT_TOGGLES },
		lessonPlans: []
	});

	return {
		subscribe,

		reset() {
			update(() => ({
				students: deepCloneStudents(),
				overriddenFlags: {},
				confirmedFlags: {},
				featureToggles: { ...DEFAULT_TOGGLES },
				lessonPlans: []
			}));
		},

		confirmFlag(studentId: string, flag: keyof FlagSet) {
			update((s) => {
				const current = s.confirmedFlags[studentId] ?? [];
				if (current.includes(flag)) return s;

				const next = [...current, flag];
				const allDone = FLAG_KEYS.every((k) => next.includes(k));

				return {
					...s,
					confirmedFlags: { ...s.confirmedFlags, [studentId]: next },
					students: allDone
						? s.students.map((st) =>
								st.id === studentId ? { ...st, validatedByTeacher: true } : st
							)
						: s.students
				};
			});
		},

		overrideFlag(studentId: string, flag: keyof FlagSet, reason: string) {
			update((s) => {
				const students = s.students.map((st) => {
					if (st.id !== studentId || !st.flags) return st;
					const current = st.flags[flag];
					return {
						...st,
						flags: {
							...st.flags,
							[flag]: {
								...current,
								value: !current.value,
								evidence: [
									...current.evidence,
									{
										source: 'derived' as const,
										detail: `Teacher override: ${reason}`,
										timestamp: Date.now()
									}
								]
							}
						}
					};
				});

				const prev = s.overriddenFlags[studentId] ?? [];
				const overriddenFlags = {
					...s.overriddenFlags,
					[studentId]: prev.includes(flag) ? prev : [...prev, flag]
				};

				return { ...s, students, overriddenFlags };
			});
		},

		/** Create a new anonymized student and return their id. */
		addStudent(classLabel: string, yearGroup: 4 | 5 | 6): string {
			let newId = '';
			update((s) => {
				const inClass = s.students.filter((st) => st.classLabel === classLabel);
				const num = String(inClass.length + 1).padStart(2, '0');
				const id = `stu-${Date.now()}`;
				newId = id;
				const newStudent: Student = {
					id,
					firstName: `Learner`,
					lastInitial: num,
					yearGroup,
					flags: null,
					validatedByTeacher: false,
					anonymizedLabel: `Class ${classLabel} – Learner ${num}`,
					classLabel,
					diagnosticCode: randomCode(),
					diagnosticStatus: 'pending'
				};
				return { ...s, students: [...s.students, newStudent] };
			});
			return newId;
		},

		setToggle(key: keyof FeatureToggles, value: boolean) {
			update((s) => ({
				...s,
				featureToggles: { ...s.featureToggles, [key]: value }
			}));
		},

		/** Simulate a student completing their diagnostic — assigns a demo flag set. */
		markDiagnosticComplete(studentId: string) {
			update((s) => {
				const idx = s.students.findIndex((st) => st.id === studentId);
				if (idx === -1) return s;
				const flagSet = DEMO_FLAG_SETS[idx % DEMO_FLAG_SETS.length];
				const students = s.students.map((st) =>
					st.id === studentId
						? { ...st, flags: JSON.parse(JSON.stringify(flagSet)), diagnosticStatus: 'completed' as const }
						: st
				);
				return { ...s, students };
			});
		},

		saveLessonPlan(plan: LessonPlan) {
			update((s) => ({ ...s, lessonPlans: [...s.lessonPlans, plan] }));
		}
	};
}

export const studentsStore = createStudentsStore();
