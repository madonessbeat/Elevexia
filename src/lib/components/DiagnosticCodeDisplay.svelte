<script lang="ts">
	import { Copy, CheckCheck } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	export let code: string;
	export let studentLabel: string;
	export let onCopy: () => void = () => {};

	let copied = false;

	async function copyLink() {
		const link = `${window.location.origin}/student?code=${code}`;
		try {
			await navigator.clipboard.writeText(link);
			copied = true;
			onCopy();
			setTimeout(() => (copied = false), 2000);
		} catch {
			// Fallback: prompt
			prompt('Copy this link and share it with the student:', link);
		}
	}
</script>

<div class="rounded-[--radius] border border-border bg-card p-6 space-y-4">
	<p class="text-sm font-medium text-muted-foreground">Diagnostic code for {studentLabel}</p>

	<div class="flex items-center gap-4">
		<div class="rounded-lg bg-primary/8 border border-primary/20 px-6 py-3">
			<span class="font-mono text-3xl font-bold tracking-[0.35em] text-primary">{code}</span>
		</div>
	</div>

	<button
		type="button"
		on:click={copyLink}
		class={cn(
			'inline-flex items-center gap-2 rounded-[--radius] px-4 py-2 text-sm font-medium transition-colors',
			copied
				? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
				: 'bg-secondary text-secondary-foreground hover:bg-muted'
		)}
	>
		{#if copied}
			<CheckCheck class="h-4 w-4" />
			Link copied!
		{:else}
			<Copy class="h-4 w-4" />
			Copy shareable link
		{/if}
	</button>

	<p class="text-xs text-muted-foreground leading-relaxed">
		Share this code or the copied link with the student. They will complete a short survey and
		quiz — results will appear automatically on their profile.
	</p>
</div>
