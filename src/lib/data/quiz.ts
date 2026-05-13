export interface QuizItemData {
	id: string;
	dokLevel: 1 | 2 | 3 | 4;
	stem: string;
	options: { value: string; label: string; isCorrect: boolean }[];
}

export const QUIZ_ITEMS: QuizItemData[] = [
	// --- DOK 1: Recall ---
	{
		id: 'q01',
		dokLevel: 1,
		stem: 'What is 8 × 7?',
		options: [
			{ value: 'a', label: '54', isCorrect: false },
			{ value: 'b', label: '56', isCorrect: true },
			{ value: 'c', label: '63', isCorrect: false },
			{ value: 'd', label: '48', isCorrect: false }
		]
	},
	{
		id: 'q02',
		dokLevel: 1,
		stem: 'What is 144 ÷ 12?',
		options: [
			{ value: 'a', label: '10', isCorrect: false },
			{ value: 'b', label: '11', isCorrect: false },
			{ value: 'c', label: '12', isCorrect: true },
			{ value: 'd', label: '14', isCorrect: false }
		]
	},
	{
		id: 'q03',
		dokLevel: 1,
		stem: 'What is 25% of 80?',
		options: [
			{ value: 'a', label: '25', isCorrect: false },
			{ value: 'b', label: '10', isCorrect: false },
			{ value: 'c', label: '40', isCorrect: false },
			{ value: 'd', label: '20', isCorrect: true }
		]
	},

	// --- DOK 2: Application ---
	{
		id: 'q04',
		dokLevel: 2,
		stem: 'A book costs £4.50. Ella buys 3 of them. How much does she spend in total?',
		options: [
			{ value: 'a', label: '£12.50', isCorrect: false },
			{ value: 'b', label: '£13.00', isCorrect: false },
			{ value: 'c', label: '£13.50', isCorrect: true },
			{ value: 'd', label: '£14.00', isCorrect: false }
		]
	},
	{
		id: 'q05',
		dokLevel: 2,
		stem: 'A rectangle is 9 cm wide and 7 cm tall. What is its area?',
		options: [
			{ value: 'a', label: '54 cm²', isCorrect: false },
			{ value: 'b', label: '63 cm²', isCorrect: true },
			{ value: 'c', label: '32 cm²', isCorrect: false },
			{ value: 'd', label: '49 cm²', isCorrect: false }
		]
	},
	{
		id: 'q06',
		dokLevel: 2,
		stem: 'Tom walks 1.5 km to school and back every day. How far does he walk in a 5-day school week?',
		options: [
			{ value: 'a', label: '7.5 km', isCorrect: false },
			{ value: 'b', label: '10 km', isCorrect: false },
			{ value: 'c', label: '12 km', isCorrect: false },
			{ value: 'd', label: '15 km', isCorrect: true }
		]
	},
	{
		id: 'q07',
		dokLevel: 2,
		stem: 'A minibus holds 14 passengers. How many minibuses are needed to take 56 children on a school trip?',
		options: [
			{ value: 'a', label: '3', isCorrect: false },
			{ value: 'b', label: '4', isCorrect: true },
			{ value: 'c', label: '5', isCorrect: false },
			{ value: 'd', label: '6', isCorrect: false }
		]
	},

	// --- DOK 3: Multi-step reasoning ---
	{
		id: 'q08',
		dokLevel: 3,
		stem: 'A school library has 4 shelves. Each shelf holds 15 books. The librarian removes 12 books for repairs, then shares the rest equally among 3 classes. How many books does each class get?',
		options: [
			{ value: 'a', label: '14', isCorrect: false },
			{ value: 'b', label: '16', isCorrect: true },
			{ value: 'c', label: '18', isCorrect: false },
			{ value: 'd', label: '20', isCorrect: false }
		]
	},
	{
		id: 'q09',
		dokLevel: 3,
		stem: 'Aisha scored 87 points in game 1 and 65 points in game 2. She needs 200 points in total to win a prize. How many more points does she still need?',
		options: [
			{ value: 'a', label: '38', isCorrect: false },
			{ value: 'b', label: '42', isCorrect: false },
			{ value: 'c', label: '48', isCorrect: true },
			{ value: 'd', label: '52', isCorrect: false }
		]
	},

	// --- DOK 4: Extended reasoning ---
	{
		id: 'q10',
		dokLevel: 4,
		stem: 'Look at this number pattern: 2, 5, 11, 23, 47 …\nEach number is made from the one before it using the same rule.\nWhat is the rule, and what number comes next?',
		options: [
			{ value: 'a', label: '93 — the rule is ×2 then −1', isCorrect: false },
			{ value: 'b', label: '94 — the rule is ×2 then add nothing', isCorrect: false },
			{ value: 'c', label: '95 — the rule is ×2 then +1', isCorrect: true },
			{ value: 'd', label: '96 — the rule is ×2 then +2', isCorrect: false }
		]
	}
];
