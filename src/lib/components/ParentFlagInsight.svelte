<script lang="ts">
	import type { FlagSet } from '$lib/types';

	export let flags: FlagSet | null;

	const INSIGHTS: Record<keyof FlagSet, string> = {
		reading_accessibility: 'Benefits from shorter, clearer text in lessons',
		attention_chunking: 'Works best with information broken into small, manageable chunks',
		language_scaffolding: 'Gets extra support with vocabulary and language',
		hands_on_learning: 'Learns best through practical, hands-on activities',
		extended_challenge: 'Ready for extra challenge — working at an advanced level'
	};

	const FLAG_KEYS: (keyof FlagSet)[] = [
		'reading_accessibility',
		'attention_chunking',
		'language_scaffolding',
		'hands_on_learning',
		'extended_challenge'
	];

	$: activeFlags = flags
		? FLAG_KEYS.filter((k) => flags![k].value)
		: [];
</script>

{#if activeFlags.length === 0}
	<div class="rounded-md bg-emerald-50 border border-emerald-200 px-4 py-3 dark:bg-emerald-950/20 dark:border-emerald-900">
		<p class="text-sm font-medium text-emerald-700 dark:text-emerald-400">Standard programme</p>
		<p class="mt-0.5 text-xs text-emerald-600 dark:text-emerald-500">
			No specific adaptations needed — your child is following the standard curriculum.
		</p>
	</div>
{:else}
	<ul class="space-y-2">
		{#each activeFlags as flag}
			<li class="flex items-start gap-2">
				<span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"></span>
				<p class="text-sm text-foreground">{INSIGHTS[flag]}</p>
			</li>
		{/each}
	</ul>
{/if}
