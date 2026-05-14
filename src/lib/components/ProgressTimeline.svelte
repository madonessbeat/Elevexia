<script lang="ts">
	import type { ProgressEvent } from '$lib/types';

	export let events: ProgressEvent[];

	function formatDate(ts: number): string {
		const days = Math.floor((Date.now() - ts) / 86_400_000);
		if (days === 0) return 'Today';
		if (days === 1) return 'Yesterday';
		return `${days} days ago`;
	}

	const TYPE_COLORS: Record<string, string> = {
		assessment_completed: 'bg-indigo-500',
		flag_confirmed: 'bg-emerald-500',
		material_generated: 'bg-violet-500'
	};
</script>

<ol class="relative space-y-0">
	{#each events as event, i}
		<li class="flex items-start gap-3 pb-4 {i < events.length - 1 ? 'border-l border-dashed border-border ml-2' : ''}">
			<span class="relative -left-2 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full {TYPE_COLORS[event.type] ?? 'bg-muted'}">
				<span class="h-1.5 w-1.5 rounded-full bg-white"></span>
			</span>
			<div class="flex-1 min-w-0">
				<p class="text-sm text-foreground">{event.label}</p>
				<p class="text-xs text-muted-foreground mt-0.5">{formatDate(event.date)}</p>
			</div>
		</li>
	{/each}
</ol>
