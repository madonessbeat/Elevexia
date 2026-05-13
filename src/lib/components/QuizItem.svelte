<script lang="ts">
	import { onMount } from 'svelte';
	import type { QuizResponse } from '$lib/types';

	export let item: {
		id: string;
		dokLevel: 1 | 2 | 3 | 4;
		stem: string;
		options: { value: string; label: string; isCorrect: boolean }[];
	};
	export let onAnswer: (response: QuizResponse) => void;

	let startTime = 0;
	let selected: string | null = null;
	let attemptCount = 0;

	onMount(() => {
		startTime = Date.now();
	});

	function select(value: string) {
		if (selected !== value) {
			selected = value;
			attemptCount += 1;
		}
	}

	function submit() {
		if (!selected) return;
		const chosenOption = item.options.find((o) => o.value === selected)!;
		onAnswer({
			itemId: item.id,
			dokLevel: item.dokLevel,
			answer: selected,
			isCorrect: chosenOption.isCorrect,
			responseTimeMs: Date.now() - startTime,
			attemptCount,
			skipped: false
		});
	}
</script>

<div class="space-y-4 rounded-[--radius] border border-border bg-card p-5">
	<div class="flex items-center justify-between">
		<span class="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
			DOK {item.dokLevel}
		</span>
	</div>

	<p class="font-display font-medium text-foreground">{item.stem}</p>

	<div class="space-y-2">
		{#each item.options as option}
			<button
				type="button"
				on:click={() => select(option.value)}
				class="flex min-h-16 w-full items-center gap-3 rounded-[--radius] border px-4 py-3 text-left transition-colors {selected ===
				option.value
					? 'border-primary bg-accent'
					: 'border-border bg-secondary hover:bg-muted'}"
			>
				<span
					class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 {selected ===
					option.value
						? 'border-primary'
						: 'border-input'}"
				>
					{#if selected === option.value}
						<span class="h-2 w-2 rounded-full bg-primary" />
					{/if}
				</span>
				<span class="text-sm">{option.label}</span>
			</button>
		{/each}
	</div>

	<button
		type="button"
		disabled={!selected}
		on:click={submit}
		class="w-full rounded-[--radius] bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
	>
		Submit answer
	</button>
</div>
