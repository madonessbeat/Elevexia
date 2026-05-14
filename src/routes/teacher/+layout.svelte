<script lang="ts">
	import { page } from '$app/state';
	import { BookOpen, Users, BarChart2, Settings, ChevronRight, Search, Lightbulb, UserPlus, ArrowLeft } from 'lucide-svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import ShortcutsDialog from '$lib/components/ShortcutsDialog.svelte';
	import { studentsStore } from '$lib/stores/students';
	import { get } from 'svelte/store';

	let { children } = $props();

	const navItems = [
		{ href: '/teacher', label: 'Dashboard', icon: BarChart2 },
		{ href: '/teacher/students', label: 'Students', icon: Users },
		{ href: '/teacher/lesson-plan', label: 'Lesson Planner', icon: Lightbulb },
		{ href: '/teacher/content', label: 'Content', icon: BookOpen },
		{ href: '/teacher/settings', label: 'Settings', icon: Settings }
	];

	const anonymizedOn = $derived($studentsStore.featureToggles.anonymizedStudents);

	function isActive(href: string): boolean {
		if (href === '/teacher') return page.url.pathname === '/teacher';
		return page.url.pathname.startsWith(href);
	}

	// ── Keyboard shortcuts ────────────────────────────────────────
	let commandOpen = $state(false);
	let shortcutsOpen = $state(false);

	$effect(() => {
		function onKey(e: KeyboardEvent) {
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault();
				commandOpen = true;
			}
			if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
				const tag = (e.target as HTMLElement)?.tagName;
				if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
				e.preventDefault();
				shortcutsOpen = true;
			}
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<CommandPalette bind:open={commandOpen} />
<ShortcutsDialog bind:open={shortcutsOpen} />

<div class="flex min-h-screen bg-background">
	<!-- Sidebar -->
	<aside class="flex w-60 shrink-0 flex-col border-r border-border bg-card">
		<div class="flex h-16 items-center justify-between border-b border-border px-4">
			<a href="/teacher" class="flex items-center gap-1.5">
				<span class="font-display text-lg font-semibold text-primary">Elevexia</span>
				<span class="text-xs font-medium text-muted-foreground">teacher</span>
			</a>
			<a
				href="/role-select"
				class="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
				title="Switch role"
			>
				<ArrowLeft class="h-3 w-3" />
				Roles
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
					<item.icon class="h-4 w-4 shrink-0" />
					{item.label}
					<ChevronRight
						class="ml-auto h-3 w-3 transition-opacity {isActive(item.href)
							? 'opacity-50'
							: 'opacity-0 group-hover:opacity-50'}"
					/>
				</a>
			{/each}
		</nav>

		<div class="border-t border-border px-3 py-4 space-y-1">
			<!-- Add Student shortcut -->
			<a
				href="/teacher/students/add"
				class="flex w-full items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
			>
				<UserPlus class="h-3 w-3 shrink-0" />
				Add Student
			</a>

			<button
				type="button"
				onclick={() => (commandOpen = true)}
				class="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
			>
				<Search class="h-3 w-3 shrink-0" />
				<span>Search</span>
				<kbd class="ml-auto rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
					⌘K
				</kbd>
			</button>

			<button
				type="button"
				onclick={() => (shortcutsOpen = true)}
				class="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
			>
				<span>Keyboard shortcuts</span>
				<kbd class="ml-auto rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
					?
				</kbd>
			</button>

			<!-- Anonymized mode indicator -->
			<div class="flex items-center justify-between rounded-md px-3 py-1.5">
				<span class="text-xs text-muted-foreground">Anon mode</span>
				<span class="rounded-full px-2 py-0.5 text-[10px] font-semibold {anonymizedOn ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}">
					{anonymizedOn ? 'ON' : 'OFF'}
				</span>
			</div>
		</div>
	</aside>

	<!-- Main content -->
	<main class="flex min-w-0 flex-1 flex-col">
		{@render children()}
	</main>
</div>
