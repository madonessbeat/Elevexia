import { writable } from 'svelte/store';
import { SEED_STUDENTS } from '$lib/data/seed';
import type { Student, FlagSet } from '$lib/types';

export const FLAG_KEYS: (keyof FlagSet)[] = [
	'reading_accessibility',
	'attention_chunking',
	'language_scaffolding',
	'hands_on_learning',
	'extended_challenge'
];

export interface StudentsState {
	students: Student[];
	/** studentId → flag keys that the teacher has overridden */
	overriddenFlags: Record<string, string[]>;
	/** studentId → flag keys that the teacher has individually confirmed */
	confirmedFlags: Record<string, string[]>;
}

function deepCloneStudents(): Student[] {
	return JSON.parse(JSON.stringify(SEED_STUDENTS));
}

function createStudentsStore() {
	const { subscribe, update } = writable<StudentsState>({
		students: deepCloneStudents(),
		overriddenFlags: {},
		confirmedFlags: {}
	});

	return {
		subscribe,

		/** Reset store to clean seed data — used by demo-reset. */
		reset() {
			update(() => ({
				students: deepCloneStudents(),
				overriddenFlags: {},
				confirmedFlags: {}
			}));
		},

		/** Mark a single flag as teacher-confirmed. Marks validatedByTeacher=true when all 5 are confirmed. */
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

		/** Flip a flag value and record the override, appending teacher-supplied reason to evidence. */
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
				// Toggle: if already in the list, keep it (still overridden); add if missing
				const overriddenFlags = {
					...s.overriddenFlags,
					[studentId]: prev.includes(flag) ? prev : [...prev, flag]
				};

				return { ...s, students, overriddenFlags };
			});
		}
	};
}

export const studentsStore = createStudentsStore();
