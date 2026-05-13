<script lang="ts">
	import type { FlagSet } from '$lib/types';
	import { cn } from '$lib/utils';
	import { BookOpen, Layers, Languages, Hand, Sparkles } from 'lucide-svelte';

	export let flag: keyof FlagSet;
	export let state: 'active' | 'overridden' | 'inactive';

	const icons = {
		reading_accessibility: BookOpen,
		attention_chunking: Layers,
		language_scaffolding: Languages,
		hands_on_learning: Hand,
		extended_challenge: Sparkles
	} as const;

	const labels: Record<keyof FlagSet, string> = {
		reading_accessibility: 'Reading',
		attention_chunking: 'Chunking',
		language_scaffolding: 'Language',
		hands_on_learning: 'Hands-on',
		extended_challenge: 'Challenge'
	};

	$: icon = icons[flag];
	$: label = labels[flag];
	$: pillClass = cn(
		'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
		state === 'active' && 'bg-primary/10 text-primary',
		state === 'overridden' && 'bg-amber-100 text-amber-700',
		state === 'inactive' && 'bg-muted text-muted-foreground'
	);
</script>

<span class={pillClass}>
	<svelte:component this={icon} size={12} />
	{label}
</span>
