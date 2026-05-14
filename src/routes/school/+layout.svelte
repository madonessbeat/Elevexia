<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import { Building2, ArrowLeft, LayoutDashboard, Users } from 'lucide-svelte';
	import { authStore } from '$lib/stores/auth';

	let { children } = $props();

	onMount(() => {
		if (get(authStore).role !== 'school') goto('/role-select');
	});

	const navItems = [
		{ href: '/school', label: 'Overview', icon: LayoutDashboard },
		{ href: '/school/teachers', label: 'Teachers', icon: Users }
	];

	function isActive(href: string): boolean {
		if (href === '/school') return page.url.pathname === '/school';
		return page.url.pathname.startsWith(href);
	}
</script>

<div class="flex min-h-screen flex-col bg-background">
	<!-- Top nav -->
	<header class="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-md">
		<div class="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
			<!-- Wordmark -->
			<div class="flex items-center gap-2 mr-4">
				<Building2 class="h-5 w-5 text-primary" />
				<div>
					<span class="font-display text-base font-bold text-primary">Elevexia</span>
					<span class="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
						School Admin
					</span>
				</div>
			</div>

			<!-- Nav links -->
			<nav class="flex items-center gap-1">
				{#each navItems as item}
					<a
						href={item.href}
						class="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors {isActive(item.href)
							? 'bg-primary/10 text-primary'
							: 'text-muted-foreground hover:bg-secondary hover:text-foreground'}"
					>
						<item.icon class="h-4 w-4" />
						{item.label}
					</a>
				{/each}
			</nav>

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
