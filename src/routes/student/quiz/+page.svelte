<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import QuizItem from '$lib/components/QuizItem.svelte';
	import { QUIZ_ITEMS } from '$lib/data/quiz';
	import type { QuizResponse } from '$lib/types';

	let currentIndex = 0;
	let responses: QuizResponse[] = [];

	$: item = QUIZ_ITEMS[currentIndex];
	$: progressPct = (currentIndex / QUIZ_ITEMS.length) * 100;

	onMount(() => {
		if (!browser) return;
		const raw = localStorage.getItem('elevexia_quiz');
		if (!raw) return;
		try {
			const saved: QuizResponse[] = JSON.parse(raw);
			responses = saved;
			// Resume at the first unanswered item
			currentIndex = Math.min(saved.length, QUIZ_ITEMS.length - 1);
		} catch {
			// Start fresh
		}
	});

	function handleAnswer(response: QuizResponse) {
		responses = [...responses, response];
		if (browser) {
			localStorage.setItem('elevexia_quiz', JSON.stringify(responses));
		}
		if (currentIndex < QUIZ_ITEMS.length - 1) {
			currentIndex++;
		} else {
			goto('/student/done');
		}
	}
</script>

<div class="mx-auto max-w-lg space-y-8 py-4">
	<!-- Progress -->
	<div class="space-y-2">
		<div class="flex items-center justify-between text-xs text-muted-foreground">
			<span>Question {currentIndex + 1} of {QUIZ_ITEMS.length}</span>
			<span>{Math.round(progressPct)}%</span>
		</div>
		<div class="h-2 w-full overflow-hidden rounded-full bg-muted">
			<div
				class="h-2 rounded-full bg-primary transition-all duration-300"
				style="width: {progressPct}%"
			></div>
		</div>
	</div>

	<!-- Item -->
	{#key currentIndex}
		<QuizItem {item} onAnswer={handleAnswer} />
	{/key}

	<p class="text-center text-xs text-muted-foreground">
		Select your answer and press <strong>Submit answer</strong> to move on.
	</p>
</div>
