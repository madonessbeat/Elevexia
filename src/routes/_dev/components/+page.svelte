<script lang="ts">
	import FlagBadge from '$lib/components/FlagBadge.svelte';
	import StudentCard from '$lib/components/StudentCard.svelte';
	import SurveyQuestion from '$lib/components/SurveyQuestion.svelte';
	import QuizItem from '$lib/components/QuizItem.svelte';
	import EvidenceList from '$lib/components/EvidenceList.svelte';
	import OverrideDialog from '$lib/components/OverrideDialog.svelte';
	import type { FlagSet, Student, EvidenceItem, QuizResponse } from '$lib/types';

	const flagKeys: (keyof FlagSet)[] = [
		'reading_accessibility',
		'attention_chunking',
		'language_scaffolding',
		'hands_on_learning',
		'extended_challenge'
	];

	// --- StudentCard ---
	const mockStudentNeedsReview: Student = {
		id: '1',
		firstName: 'Alex',
		lastInitial: 'J',
		yearGroup: 5,
		flags: {
			reading_accessibility: { value: true, confidence: 'high', evidence: [] },
			attention_chunking: { value: false, confidence: 'low', evidence: [] },
			language_scaffolding: { value: true, confidence: 'medium', evidence: [] },
			hands_on_learning: { value: false, confidence: 'low', evidence: [] },
			extended_challenge: { value: true, confidence: 'high', evidence: [] }
		},
		validatedByTeacher: false
	};
	const mockStudentValidated: Student = {
		...mockStudentNeedsReview,
		id: '2',
		firstName: 'Jordan',
		lastInitial: 'K',
		validatedByTeacher: true
	};
	const mockStudentNoFlags: Student = {
		...mockStudentNeedsReview,
		id: '3',
		firstName: 'Sam',
		lastInitial: 'T',
		flags: null
	};

	// --- SurveyQuestion ---
	let surveyValue: string | null = null;
	const mockQuestion = {
		id: 'q1',
		text: 'How do you prefer to learn new concepts?',
		options: [
			{ value: 'visual', label: 'Through diagrams and images' },
			{ value: 'reading', label: 'By reading detailed explanations' },
			{ value: 'hands_on', label: 'Hands-on activities and experiments' },
			{ value: 'listening', label: 'Listening and discussion' }
		]
	};

	// --- QuizItem ---
	const mockQuizItem = {
		id: 'qi1',
		dokLevel: 2 as const,
		stem: 'A train travels 120 km in 2 hours. What is its average speed?',
		options: [
			{ value: 'a', label: '60 km/h', isCorrect: true },
			{ value: 'b', label: '240 km/h', isCorrect: false },
			{ value: 'c', label: '80 km/h', isCorrect: false },
			{ value: 'd', label: '45 km/h', isCorrect: false }
		]
	};
	let quizResult: QuizResponse | null = null;

	// --- EvidenceList ---
	const mockEvidence: EvidenceItem[] = [
		{
			source: 'survey',
			detail: 'Prefers hands-on learning activities',
			timestamp: Date.now() - 5 * 60_000
		},
		{
			source: 'quiz',
			detail: 'Took 2.5× average time on reading-heavy question',
			timestamp: Date.now() - 3_600_000
		},
		{
			source: 'derived',
			detail: 'Pattern consistent with reading accessibility flag',
			timestamp: Date.now() - 86_400_000
		}
	];

	// --- OverrideDialog ---
	let dialogOpen = false;
	let lastOverrideReason = '';
</script>

<div class="mx-auto max-w-2xl space-y-14 px-4 py-10">
	<h1 class="font-display text-2xl font-bold text-foreground">Component dev sandbox</h1>

	<!-- FlagBadge -->
	<section class="space-y-3">
		<h2 class="font-display text-base font-semibold text-foreground">FlagBadge</h2>
		<div class="flex flex-wrap gap-2">
			{#each flagKeys as f}
				<FlagBadge flag={f} state="active" />
			{/each}
		</div>
		<div class="flex flex-wrap gap-2">
			{#each flagKeys as f}
				<FlagBadge flag={f} state="overridden" />
			{/each}
		</div>
		<div class="flex flex-wrap gap-2">
			{#each flagKeys as f}
				<FlagBadge flag={f} state="inactive" />
			{/each}
		</div>
	</section>

	<!-- StudentCard -->
	<section class="space-y-3">
		<h2 class="font-display text-base font-semibold text-foreground">StudentCard</h2>
		<div class="grid gap-3 sm:grid-cols-2">
			<StudentCard student={mockStudentNeedsReview} />
			<StudentCard student={mockStudentValidated} />
			<StudentCard student={mockStudentNoFlags} />
		</div>
	</section>

	<!-- SurveyQuestion -->
	<section class="space-y-3">
		<h2 class="font-display text-base font-semibold text-foreground">SurveyQuestion</h2>
		<SurveyQuestion
			question={mockQuestion}
			value={surveyValue}
			onChange={(v) => (surveyValue = v)}
		/>
		<p class="text-xs text-muted-foreground">Selected: {surveyValue ?? 'none'}</p>
	</section>

	<!-- QuizItem -->
	<section class="space-y-3">
		<h2 class="font-display text-base font-semibold text-foreground">QuizItem</h2>
		<QuizItem item={mockQuizItem} onAnswer={(r) => (quizResult = r)} />
		{#if quizResult}
			<pre class="overflow-x-auto rounded-[--radius] bg-secondary p-3 text-xs">{JSON.stringify(
					quizResult,
					null,
					2
				)}</pre>
		{/if}
	</section>

	<!-- EvidenceList -->
	<section class="space-y-3">
		<h2 class="font-display text-base font-semibold text-foreground">EvidenceList</h2>
		<div class="rounded-[--radius] border border-border bg-card p-4">
			<EvidenceList items={mockEvidence} />
		</div>
	</section>

	<!-- OverrideDialog -->
	<section class="space-y-3">
		<h2 class="font-display text-base font-semibold text-foreground">OverrideDialog</h2>
		<button
			type="button"
			on:click={() => (dialogOpen = true)}
			class="rounded-[--radius] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
		>
			Open override dialog
		</button>
		{#if lastOverrideReason}
			<p class="text-xs text-muted-foreground">Last confirmed reason: "{lastOverrideReason}"</p>
		{/if}
		<OverrideDialog
			open={dialogOpen}
			flag="reading_accessibility"
			currentValue={true}
			onConfirm={(reason) => {
				lastOverrideReason = reason;
				dialogOpen = false;
			}}
			onCancel={() => (dialogOpen = false)}
		/>
	</section>
</div>
