<script lang="ts">
	import { cn } from '$lib/utils';
	import type { ComponentType } from 'svelte';

	export let title: string;
	export let description: string;
	export let href: string;
	export let iconBg: string;
	export let iconColor: string;
	export let Icon: ComponentType;
	export let onclick: () => void = () => {};
</script>

<a
	{href}
	on:click|preventDefault={onclick}
	class={cn(
		'group flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-8 text-center',
		'shadow-sm transition-all duration-150 hover:-translate-y-1 hover:shadow-lg',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
	)}
>
	<div class={cn('flex h-20 w-20 items-center justify-center rounded-2xl', iconBg)}>
		<svelte:component this={Icon} class={cn('h-9 w-9', iconColor)} />
	</div>
	<div>
		<p class="font-display text-lg font-bold text-foreground">{title}</p>
		<p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
	</div>
	<span
		class={cn(
			'mt-auto inline-flex items-center gap-1 text-xs font-semibold transition-colors',
			iconColor,
			'group-hover:underline'
		)}
	>
		Enter dashboard →
	</span>
</a>
