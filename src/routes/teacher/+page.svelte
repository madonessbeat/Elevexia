<script lang="ts">
	import { crossfade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { dev } from '$app/environment';
	import { FileText, RotateCcw, Users, UserPlus, Lightbulb, X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import StudentCard from '$lib/components/StudentCard.svelte';
	import { studentsStore } from '$lib/stores/students';
	import type { Student, Flag } from '$lib/types';

	// ── Filter state ──────────────────────────────────────────────
	type Filter = 'all' | 'needs_review' | 'validated' | 'pending_diagnostic';
	let activeFilter: Filter = $state('all');

	const anonymizedOn = $derived($studentsStore.featureToggles.anonymizedStudents);
	const lessonPlans = $derived($studentsStore.lessonPlans);
	let bannerDismissed = $state(false);

	const allStudents = $derived($studentsStore.students);
	const needsReview = $derived(
		allStudents.filter((s) => s.flags !== null && !s.validatedByTeacher)
	);
	const validated = $derived(allStudents.filter((s) => s.validatedByTeacher));
	const pendingDiagnostic = $derived(allStudents.filter((s) => s.diagnosticStatus === 'pending'));

	const filtered = $derived(
		allStudents.filter((s) => {
			if (activeFilter === 'needs_review') return s.flags !== null && !s.validatedByTeacher;
			if (activeFilter === 'validated') return s.validatedByTeacher;
			if (activeFilter === 'pending_diagnostic') return s.diagnosticStatus === 'pending';
			return true;
		})
	);

	const chips = $derived([
		{ id: 'all' as Filter, label: 'All' },
		{ id: 'needs_review' as Filter, label: `Needs review (${needsReview.length})` },
		{ id: 'validated' as Filter, label: `Validated (${validated.length})` },
		{ id: 'pending_diagnostic' as Filter, label: `Awaiting diagnostic (${pendingDiagnostic.length})` }
	]);

	// ── Crossfade for chip pill ───────────────────────────────────
	const [send, receive] = crossfade({ duration: 250, easing: cubicInOut });

	// ── Sticky bar data ───────────────────────────────────────────
	function computeLastAssessment(students: Student[]): number | null {
		const ts = students.flatMap((s) =>
			s.flags
				? (Object.values(s.flags) as Flag[]).flatMap((f) => f.evidence.map((e) => e.timestamp))
				: []
		);
		return ts.length ? Math.max(...ts) : null;
	}

	function timeAgo(ms: number): string {
		const days = Math.floor((Date.now() - ms) / 86_400_000);
		if (days === 0) return 'today';
		if (days === 1) return '1 day ago';
		return `${days} days ago`;
	}

	const lastAssessmentTime = $derived(computeLastAssessment(allStudents));
	const lastAssessmentStr = $derived(lastAssessmentTime ? timeAgo(lastAssessmentTime) : 'never');

	// ── Skeleton loading ──────────────────────────────────────────
	let loaded = $state(false);
	$effect(() => {
		const t = setTimeout(() => (loaded = true), 200);
		return () => clearTimeout(t);
	});

	// ── Actions ───────────────────────────────────────────────────
	function handleReset() {
		studentsStore.reset();
		activeFilter = 'all';
		bannerDismissed = false;
		toast.success('Demo data reset.');
	}

	function handleReport() {
		toast.info('Class reports are coming in Phase 2.');
	}
</script>

<!-- Sticky top bar -->
<div class="sticky top-0 z-10 border-b border-border bg-background/70 backdrop-blur-md">
	<div class="flex items-center gap-2 px-8 py-3">
		<p class="text-sm font-semibold text-foreground">
			{anonymizedOn ? 'Year 5 Maple — Anonymized View' : 'Year 5 Maple'}
		</p>
		<span class="text-muted-foreground/40">·</span>
		<p class="text-sm text-muted-foreground"><span class="tabular-nums">{allStudents.length}</span> students</p>
		<span class="text-muted-foreground/40">·</span>
		<p class="text-sm text-muted-foreground"><span class="tabular-nums">{needsReview.length}</span> awaiting review</p>
		<span class="text-muted-foreground/40">·</span>
		<p class="text-sm text-muted-foreground">last assessment {lastAssessmentStr}</p>
	</div>
</div>

<!-- Active lesson plan banner -->
{#if lessonPlans.length > 0 && !bannerDismissed}
	{@const latest = lessonPlans[lessonPlans.length - 1]}
	<div class="flex items-center gap-3 border-b border-primary/20 bg-primary/8 px-8 py-3">
		<Lightbulb class="h-4 w-4 shrink-0 text-primary" />
		<p class="flex-1 text-sm text-foreground">
			<span class="font-semibold">Active lesson plan:</span>
			<span class="ml-1 text-muted-foreground line-clamp-1">"{latest.objectives}"</span>
		</p>
		<a href="/teacher/lesson-plan" class="text-xs font-medium text-primary hover:underline underline-offset-2">
			View plan
		</a>
		<button
			type="button"
			onclick={() => (bannerDismissed = true)}
			class="text-muted-foreground hover:text-foreground transition-colors"
			aria-label="Dismiss banner"
		>
			<X class="h-3.5 w-3.5" />
		</button>
	</div>
{/if}

<div class="p-8">
	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-foreground">Year 5 Maple</h1>
			<p class="mt-0.5 text-sm text-muted-foreground">{allStudents.length} students</p>
		</div>

		<div class="flex items-center gap-2">
			{#if dev}
				<button
					type="button"
					onclick={handleReset}
					class="flex items-center gap-2 rounded-[--radius] border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-950/60"
					title="Reset all students to clean seed data"
				>
					<RotateCcw class="h-3.5 w-3.5" />
					Reset demo
				</button>
			{/if}

			<a
				href="/teacher/students/add"
				class="flex items-center gap-2 rounded-[--radius] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
			>
				<UserPlus class="h-4 w-4" />
				Add Student
			</a>

			<button
				type="button"
				onclick={handleReport}
				class="flex items-center gap-2 rounded-[--radius] border border-border bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
			>
				<FileText class="h-4 w-4" />
				Generate class report
			</button>
		</div>
	</div>

	<!-- Filter chips with sliding pill -->
	<div class="mb-5 flex flex-wrap gap-1 rounded-full bg-secondary p-1">
		{#each chips as chip (chip.id)}
			<button
				type="button"
				onclick={() => (activeFilter = chip.id)}
				class="relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary {activeFilter === chip.id
					? 'text-primary-foreground'
					: 'text-muted-foreground hover:text-foreground'}"
			>
				{#if activeFilter === chip.id}
					<span
						class="absolute inset-0 rounded-full bg-primary"
						in:receive={{ key: 'chip-active' }}
						out:send={{ key: 'chip-active' }}
					></span>
				{/if}
				<span class="relative z-10">{chip.label}</span>
			</button>
		{/each}
	</div>

	<!-- Student grid -->
	{#if !loaded}
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each Array(5) as _, i}
				<div class="animate-pulse rounded-[--radius] border border-border bg-card p-4">
					<div class="flex items-center gap-3">
						<div class="h-10 w-10 rounded-full bg-muted"></div>
						<div class="flex-1 space-y-2">
							<div class="h-4 w-3/4 rounded bg-muted"></div>
							<div class="h-3 w-1/2 rounded bg-muted"></div>
						</div>
					</div>
					<div class="mt-3 flex gap-2">
						{#each Array(5) as _}
							<div class="h-6 w-6 rounded-full bg-muted"></div>
						{/each}
					</div>
					<div class="mt-2 h-3 w-1/3 rounded bg-muted"></div>
				</div>
			{/each}
		</div>
	{:else if filtered.length === 0}
		<div class="flex flex-col items-center gap-3 py-16 text-center">
			<Users class="h-10 w-10 text-muted-foreground/40" />
			<div>
				<p class="text-sm font-medium text-foreground">No students here</p>
				<p class="mt-0.5 text-xs text-muted-foreground">
					{#if activeFilter === 'needs_review'}
						All students have been reviewed — great work.
					{:else if activeFilter === 'validated'}
						No students have been validated yet.
					{:else if activeFilter === 'pending_diagnostic'}
						No students are waiting for a diagnostic.
					{:else}
						No students in this class yet.
						<a href="/teacher/students/add" class="text-primary underline underline-offset-2">Add one now.</a>
					{/if}
				</p>
			</div>
			{#if activeFilter !== 'all'}
				<button
					type="button"
					onclick={() => (activeFilter = 'all')}
					class="text-xs text-primary underline underline-offset-4 hover:text-primary/80"
				>
					View all students
				</button>
			{/if}
		</div>
	{:else}
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each filtered as student (student.id)}
				<a
					href="/teacher/student/{student.id}"
					class="block rounded-[--radius] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
				>
					<StudentCard {student} anonymized={anonymizedOn} />
				</a>
			{/each}
		</div>
	{/if}
</div>
