<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import SurveyQuestion from '$lib/components/SurveyQuestion.svelte';
	import { SURVEY_QUESTIONS } from '$lib/data/survey';
	import type { SurveyResponse } from '$lib/types';

	let currentIndex = 0;
	let answers: Record<string, string> = {};
	let advanceTimer: ReturnType<typeof setTimeout> | null = null;

	$: q = SURVEY_QUESTIONS[currentIndex];
	$: currentValue = (answers[q?.id] as string) ?? null;
	$: progressPct = ((currentIndex + 1) / SURVEY_QUESTIONS.length) * 100;
	$: canGoBack = currentIndex > 0;
	$: canGoNext = currentValue !== null;

	onMount(() => {
		if (!browser) return;
		const raw = localStorage.getItem('elevexia_survey');
		if (!raw) return;
		try {
			const saved: SurveyResponse[] = JSON.parse(raw);
			for (const r of saved) answers[r.questionId] = r.value;
			answers = { ...answers };
			const first = SURVEY_QUESTIONS.findIndex((sq) => !answers[sq.id]);
			currentIndex = first === -1 ? SURVEY_QUESTIONS.length - 1 : first;
		} catch {
			// Corrupted — start fresh
		}
	});

	onDestroy(() => {
		if (advanceTimer) clearTimeout(advanceTimer);
	});

	function persist() {
		if (!browser) return;
		const responses: SurveyResponse[] = SURVEY_QUESTIONS.filter(
			(sq) => answers[sq.id] !== undefined
		).map((sq) => ({ questionId: sq.id, value: answers[sq.id], answeredAt: Date.now() }));
		localStorage.setItem('elevexia_survey', JSON.stringify(responses));
	}

	function advance() {
		if (advanceTimer) { clearTimeout(advanceTimer); advanceTimer = null; }
		if (currentIndex < SURVEY_QUESTIONS.length - 1) {
			currentIndex++;
		} else {
			goto('/student/quiz');
		}
	}

	function back() {
		if (advanceTimer) { clearTimeout(advanceTimer); advanceTimer = null; }
		currentIndex--;
	}

	function handleChange(value: string) {
		if (advanceTimer) { clearTimeout(advanceTimer); advanceTimer = null; }
		answers = { ...answers, [q.id]: value };
		persist();
		advanceTimer = setTimeout(advance, 600);
	}
</script>

<div class="mx-auto max-w-lg space-y-8 py-4">
	<!-- Progress -->
	<div class="space-y-2">
		<div class="flex items-center justify-between text-xs text-muted-foreground">
			<span>Question <span class="tabular-nums">{currentIndex + 1}</span> of <span class="tabular-nums">{SURVEY_QUESTIONS.length}</span></span>
			<span class="tabular-nums">{Math.round(progressPct)}%</span>
		</div>
		<div class="h-2 w-full overflow-hidden rounded-full bg-muted">
			<div
				class="h-2 rounded-full bg-primary transition-all duration-300"
				style="width: {progressPct}%"
			></div>
		</div>
	</div>

	<!-- Question -->
	{#key currentIndex}
		<SurveyQuestion question={q} value={currentValue} onChange={handleChange} />
	{/key}

	<!-- Navigation -->
	<div class="flex items-center justify-between gap-3 pt-2">
		{#if canGoBack}
			<button
				type="button"
				on:click={back}
				class="rounded-[--radius] border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-muted"
			>
				Back
			</button>
		{:else}
			<div></div>
		{/if}

		<button
			type="button"
			disabled={!canGoNext}
			on:click={advance}
			class="rounded-[--radius] bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
		>
			{currentIndex === SURVEY_QUESTIONS.length - 1 ? 'Start quiz →' : 'Next'}
		</button>
	</div>
</div>
