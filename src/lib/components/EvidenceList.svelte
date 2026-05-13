<script lang="ts">
	import type { EvidenceItem } from '$lib/types';
	import { ClipboardList, Brain, Lightbulb } from 'lucide-svelte';

	export let items: EvidenceItem[];

	const sourceIcons = {
		survey: ClipboardList,
		quiz: Brain,
		derived: Lightbulb
	} as const;

	function relativeTime(ts: number): string {
		const diff = Date.now() - ts;
		const mins = Math.floor(diff / 60_000);
		if (mins < 1) return 'just now';
		if (mins < 60) return `${mins}m ago`;
		const hrs = Math.floor(mins / 60);
		if (hrs < 24) return `${hrs}h ago`;
		return `${Math.floor(hrs / 24)}d ago`;
	}
</script>

<ul class="space-y-2">
	{#each items as item}
		<li class="flex items-start gap-2 text-sm text-foreground">
			<span class="mt-0.5 shrink-0 text-muted-foreground">
				<svelte:component this={sourceIcons[item.source]} size={14} />
			</span>
			<span class="flex-1">{item.detail}</span>
			<span class="shrink-0 text-xs text-muted-foreground">{relativeTime(item.timestamp)}</span>
		</li>
	{/each}
</ul>
