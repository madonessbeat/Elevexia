<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import { Heart, ArrowLeft } from 'lucide-svelte';
	import { authStore } from '$lib/stores/auth';

	let { children } = $props();

	onMount(() => {
		if (get(authStore).role !== 'parent') goto('/role-select');
	});
</script>

<div class="flex min-h-screen flex-col bg-secondary/30">
	<!-- Top nav -->
	<header class="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur-md">
		<div class="mx-auto flex max-w-4xl items-center gap-4 px-6 py-3">
			<div class="flex items-center gap-2">
				<Heart class="h-4 w-4 text-violet-500" />
				<span class="font-display text-base font-bold text-primary">Elevexia</span>
				<span class="ml-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-950 dark:text-violet-300">
					Parent View
				</span>
			</div>

			<div class="ml-auto">
				<a
					href="/role-select"
					class="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
				>
					<ArrowLeft class="h-3.5 w-3.5" />
					Switch role
				</a>
			</div>
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>
</div>
