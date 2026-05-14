<script lang="ts">
	import { cn } from '$lib/utils';

	export let checked: boolean;
	export let disabled = false;
	export let label = '';
	export let onToggle: (v: boolean) => void = () => {};
</script>

<button
	type="button"
	role="switch"
	aria-checked={checked}
	aria-label={label}
	{disabled}
	on:click={() => !disabled && onToggle(!checked)}
	class={cn(
		'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
		'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
		checked ? 'bg-primary' : 'bg-muted',
		disabled && 'cursor-not-allowed opacity-50'
	)}
>
	<span
		class={cn(
			'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200',
			checked ? 'translate-x-5' : 'translate-x-0'
		)}
	></span>
</button>
