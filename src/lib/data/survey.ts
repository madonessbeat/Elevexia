export interface SurveyQuestionData {
	id: string;
	text: string;
	options: { value: string; label: string }[];
}

export const SURVEY_QUESTIONS: SurveyQuestionData[] = [
	{
		id: 'learning_pref',
		text: 'How do you like to learn new things?',
		options: [
			{ value: 'try', label: 'I like to try things out myself' },
			{ value: 'see', label: 'I like to watch someone show me how' },
			{ value: 'read', label: 'I like to read about it and find out' },
			{ value: 'listen', label: 'I like to listen to my teacher explain' }
		]
	},
	{
		id: 'attention_self',
		text: 'How easy is it for you to stay focused in class?',
		options: [
			{ value: 'fine', label: 'Easy — I can concentrate for a long time' },
			{ value: 'sometimes', label: 'Okay most of the time' },
			{ value: 'hard', label: 'Hard — I find it difficult to concentrate' },
			{ value: 'often_loses_focus', label: 'Very hard — I lose focus all the time' }
		]
	},
	{
		id: 'reading_exp',
		text: 'What is reading like for you?',
		options: [
			{ value: 'easy', label: 'Easy — I really enjoy reading' },
			{ value: 'slow', label: 'I read slowly, but I get there' },
			{ value: 'jump_around', label: 'I have to re-read things a few times' },
			{ value: 'hard', label: 'I find reading really hard' }
		]
	},
	{
		id: 'home_language',
		text: 'What language do you mostly speak at home?',
		options: [
			{ value: 'english', label: 'English' },
			{ value: 'bilingual', label: 'English and another language' },
			{ value: 'mostly_other', label: 'Mostly another language (not much English)' },
			{ value: 'learning_en', label: "I'm just learning English" }
		]
	},
	{
		id: 'language_confidence',
		text: 'How do you feel about understanding English in class?',
		options: [
			{ value: 'fluent', label: 'I understand everything easily' },
			{ value: 'mostly', label: 'I understand most things' },
			{ value: 'sometimes', label: 'I sometimes miss what is being said' },
			{ value: 'learning', label: "I'm still learning English and it can be tricky" }
		]
	},
	{
		id: 'persistence',
		text: 'When a question is really hard, what do you usually do?',
		options: [
			{ value: 'keeps_going', label: 'I keep trying until I work it out' },
			{ value: 'gets_help', label: 'I ask my teacher or a friend for help' },
			{ value: 'takes_break', label: 'I take a break and come back to it' },
			{ value: 'gives_up', label: 'I skip it and move on' }
		]
	},
	{
		id: 'help_seeking',
		text: 'If you get stuck on something, what do you do first?',
		options: [
			{ value: 'tries_first', label: 'I try lots of different ways to solve it myself' },
			{ value: 'experiments', label: 'I experiment until I figure it out' },
			{ value: 'asks_teacher', label: 'I ask my teacher straight away' },
			{ value: 'asks_friend', label: 'I ask a friend' }
		]
	},
	{
		id: 'focus_duration',
		text: 'How do you feel after working on schoolwork for a while?',
		options: [
			{ value: 'fine', label: 'Fine — I can keep going easily' },
			{ value: 'tired', label: 'A bit tired, but okay' },
			{ value: 'hard', label: "Hard to keep my mind on it" },
			{ value: 'distracted', label: 'I get distracted and my mind wanders' }
		]
	},
	{
		id: 'preferred_format',
		text: 'What kind of activities do you enjoy most at school?',
		options: [
			{ value: 'text', label: 'Reading and writing tasks' },
			{ value: 'hands_on', label: 'Making things or doing experiments' },
			{ value: 'visual', label: 'Looking at diagrams, pictures, or videos' },
			{ value: 'practical', label: 'Solving real-life problems' }
		]
	},
	{
		id: 'difficulty_self',
		text: 'How do you usually find schoolwork?',
		options: [
			{ value: 'easy', label: "Too easy — I want harder challenges" },
			{ value: 'appropriate', label: 'Just right for me' },
			{ value: 'sometimes_hard', label: 'Sometimes a bit too hard' },
			{ value: 'often_hard', label: 'Often quite hard for me' }
		]
	}
];
