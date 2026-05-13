<script lang="ts">
	import { dev } from '$app/environment';
	import { FileText, RotateCcw } from 'lucide-svelte';
	import StudentCard from '$lib/components/StudentCard.svelte';
	import { studentsStore } from '$lib/stores/students';

	type Filter = 'all' | 'needs_review' | 'validated';
	let activeFilter: Filter = 'all';

	$: all = $studentsStore.students;
	$: needsReviewCount = all.filter((s) => s.flags !== null && !s.validatedByTeacher).length;
	$: validatedCount = all.filter((s) => s.validatedByTeacher).length;

	$: filtered = all.filter((s) => {
		if (activeFilter === 'needs_review') return s.flags !== null && !s.validatedByTeacher;
		if (activeFilter === 'validated') return s.validatedByTeacher;
		return true;
	});

	const chips: { id: Filter; label: () => string }[] = [
		{ id: 'all', label: () => 'All' },
		{ id: 'needs_review', label: () => `Needs review (${needsReviewCount})` },
		{ id: 'validated', label: () => `Validated (${validatedCount})` }
	];

	function handleReset() {
		studentsStore.reset();
		activeFilter = 'all';
	}
</script>

<div class="p-8">
	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-foreground">Year 5 Maple</h1>
			<p class="mt-0.5 text-sm text-muted-foreground">{all.length} students</p>
		</div>

		<div class="flex items-center gap-2">
			{#if dev}
				<button
					type="button"
					on:click={handleReset}
					class="flex items-center gap-2 rounded-[--radius] border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100"
					title="Reset all students to clean seed data"
				>
					<RotateCcw class="h-3.5 w-3.5" />
					Reset demo
				</button>
			{/if}

			<div class="group relative">
				<button
					disabled
					class="flex items-center gap-2 rounded-[--radius] border border-border bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground opacity-60"
					aria-describedby="report-tooltip"
				>
					<FileText class="h-4 w-4" />
					Generate class report
				</button>
				<div
					id="report-tooltip"
					role="tooltip"
					class="pointer-events-none absolute right-0 top-full mt-1.5 hidden rounded-md bg-foreground px-2.5 py-1 text-xs text-background shadow group-hover:block"
				>
					Coming soon
				</div>
			</div>
		</div>
	</div>

	<!-- Filter chips -->
	<div class="mb-5 flex gap-2">
		{#each chips as chip}
			<button
				type="button"
				on:click={() => (activeFilter = chip.id)}
				class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors {activeFilter ===
				chip.id
					? 'bg-primary text-primary-foreground'
					: 'bg-secondary text-secondary-foreground hover:bg-muted'}"
			>
				{chip.label()}
			</button>
		{/each}
	</div>

	<!-- Student grid -->
	{#if filtered.length === 0}
		<p class="text-sm text-muted-foreground">No students match this filter.</p>
	{:else}
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each filtered as student (student.id)}
				<a href="/teacher/student/{student.id}" class="block rounded-[--radius] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
					<StudentCard {student} />
				</a>
			{/each}
		</div>
	{/if}
</div>
