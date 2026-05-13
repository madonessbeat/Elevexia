<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { evaluate } from '$lib/rules/engine';
	import { CheckCircle, Loader } from 'lucide-svelte';
	import type { SurveyResponse, QuizResponse } from '$lib/types';

	let status: 'loading' | 'done' | 'error' = 'loading';

	onMount(async () => {
		if (!browser) return;

		const surveyRaw = localStorage.getItem('elevexia_survey');
		const quizRaw = localStorage.getItem('elevexia_quiz');

		if (!surveyRaw || !quizRaw) {
			status = 'done';
			return;
		}

		try {
			const surveyResponses: SurveyResponse[] = JSON.parse(surveyRaw);
			const quizResponses: QuizResponse[] = JSON.parse(quizRaw);

			const flagSet = evaluate({ surveyResponses, quizResponses, now: Date.now() });

			// Fire and forget — skeleton endpoint
			fetch('/api/profile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ surveyResponses, quizResponses, flagSet })
			}).catch(() => {});

			localStorage.removeItem('elevexia_survey');
			localStorage.removeItem('elevexia_quiz');
		} catch (err) {
			console.error('[done] Error processing assessment:', err);
			status = 'error';
			return;
		}

		status = 'done';
	});
</script>

<div class="flex min-h-[70vh] flex-col items-center justify-center text-center">
	{#if status === 'loading'}
		<div class="flex flex-col items-center gap-4 text-muted-foreground">
			<Loader class="h-8 w-8 animate-spin" />
			<p class="text-sm">Saving your answers…</p>
		</div>
	{:else if status === 'error'}
		<div class="max-w-sm space-y-4">
			<p class="text-destructive font-medium">Something went wrong saving your answers.</p>
			<p class="text-sm text-muted-foreground">Please let your teacher know.</p>
		</div>
	{:else}
		<div class="w-full max-w-sm space-y-6">
			<div class="flex justify-center">
				<div class="rounded-full bg-primary/10 p-6">
					<CheckCircle class="h-12 w-12 text-primary" />
				</div>
			</div>

			<div class="space-y-3">
				<h1 class="font-display text-3xl font-bold text-foreground">Great work!</h1>
				<p class="text-muted-foreground">
					You've finished all your questions. Your teacher will use your answers to make sure
					the work you get is just right for you.
				</p>
			</div>

			<div class="rounded-[--radius] bg-secondary px-5 py-4 text-sm text-secondary-foreground">
				You can close this page or wait for your teacher to tell you what to do next.
			</div>
		</div>
	{/if}
</div>
