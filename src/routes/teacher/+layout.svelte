<script lang="ts">
	import { page } from '$app/stores';
	import { BookOpen, Users, BarChart2, Settings, ChevronRight } from 'lucide-svelte';

	const navItems = [
		{ href: '/teacher', label: 'Dashboard', icon: BarChart2 },
		{ href: '/teacher/students', label: 'Students', icon: Users },
		{ href: '/teacher/content', label: 'Content', icon: BookOpen },
		{ href: '/teacher/settings', label: 'Settings', icon: Settings }
	];

	function isActive(href: string): boolean {
		if (href === '/teacher') return $page.url.pathname === '/teacher';
		return $page.url.pathname.startsWith(href);
	}
</script>

<div class="flex min-h-screen bg-background">
	<!-- Sidebar -->
	<aside class="flex w-60 shrink-0 flex-col border-r border-border bg-card">
		<div class="flex h-16 items-center border-b border-border px-6">
			<a href="/teacher" class="flex items-center gap-1.5">
				<span class="font-display text-lg font-semibold text-primary">Elevexia</span>
				<span class="text-xs font-medium text-muted-foreground">teacher</span>
			</a>
		</div>

		<nav class="flex-1 space-y-1 px-3 py-4">
			{#each navItems as item}
				<a
					href={item.href}
					class="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors {isActive(item.href)
						? 'bg-accent text-accent-foreground'
						: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
				>
					<svelte:component this={item.icon} class="h-4 w-4 shrink-0" />
					{item.label}
					<ChevronRight
						class="ml-auto h-3 w-3 transition-opacity {isActive(item.href)
							? 'opacity-50'
							: 'opacity-0 group-hover:opacity-50'}"
					/>
				</a>
			{/each}
		</nav>

		<div class="border-t border-border px-3 py-4">
			<p class="px-3 text-xs text-muted-foreground">Adaptive Learning Prototype</p>
		</div>
	</aside>

	<!-- Main content -->
	<main class="flex min-w-0 flex-1 flex-col">
		<slot />
	</main>
</div>
