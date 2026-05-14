import { writable } from 'svelte/store';
import type { TeacherProfile, SchoolStats } from '$lib/types';

const SEED_TEACHERS: TeacherProfile[] = [
	{
		id: 'tc-1',
		name: 'Ms. R. Chen',
		subject: 'Maths',
		yearGroups: ['Year 5', 'Year 6'],
		studentCount: 28,
		lastActiveDaysAgo: 1
	},
	{
		id: 'tc-2',
		name: 'Mr. K. Okafor',
		subject: 'English',
		yearGroups: ['Year 4', 'Year 5'],
		studentCount: 24,
		lastActiveDaysAgo: 3
	},
	{
		id: 'tc-3',
		name: 'Dr. A. Patel',
		subject: 'Science',
		yearGroups: ['Year 5'],
		studentCount: 31,
		lastActiveDaysAgo: 0
	},
	{
		id: 'tc-4',
		name: 'Ms. T. Williams',
		subject: 'History',
		yearGroups: ['Year 6'],
		studentCount: 22,
		lastActiveDaysAgo: 12
	},
	{
		id: 'tc-5',
		name: 'Mr. D. Brooks',
		subject: 'Computing',
		yearGroups: ['Year 4', 'Year 5', 'Year 6'],
		studentCount: 19,
		lastActiveDaysAgo: 5
	}
];

const SEED_STATS: SchoolStats = {
	totalStudents: 124,
	assessmentsCompleted: 89,
	materialsGenerated: 47,
	teacherCount: 5
};

interface SchoolState {
	teachers: TeacherProfile[];
	stats: SchoolStats;
}

function createSchoolStore() {
	const { subscribe } = writable<SchoolState>({
		teachers: SEED_TEACHERS,
		stats: SEED_STATS
	});

	return { subscribe };
}

export const schoolStore = createSchoolStore();
