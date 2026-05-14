<script lang="ts">
	import { cn } from '$lib/utils';
	import type { ComponentType } from 'svelte';

	export let label: string;
	export let value: number | string;
	export let Icon: ComponentType;
	export let iconClass = 'text-primary';
</script>

<div class="rounded-[--radius] border border-border bg-card p-5 stat-enter">
	<div class="flex items-center justify-between mb-3">
		<p class="text-sm font-medium text-muted-foreground">{label}</p>
		<div class={cn('flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10', iconClass.replace('text-', 'text-'))}>
			<svelte:component this={Icon} class={cn('h-4 w-4', iconClass)} />
		</div>
	</div>
	<p class="font-display text-3xl font-bold text-foreground tabular-nums">{value}</p>
</div>
