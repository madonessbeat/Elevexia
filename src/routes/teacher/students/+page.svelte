<script lang="ts">
	import { goto } from '$app/navigation';
	import { UserPlus } from 'lucide-svelte';
	import StudentCard from '$lib/components/StudentCard.svelte';
	import { studentsStore } from '$lib/stores/students';

	type Filter = 'all' | 'needs_review' | 'validated' | 'pending_diagnostic';
	let activeFilter: Filter = 'all';

	$: all = $studentsStore.students;
	$: anonymizedOn = $studentsStore.featureToggles.anonymizedStudents;
	$: needsReviewCount = all.filter((s) => s.flags !== null && !s.validatedByTeacher).length;
	$: validatedCount = all.filter((s) => s.validatedByTeacher).length;
	$: pendingCount = all.filter((s) => s.diagnosticStatus === 'pending').length;

	$: filtered = all.filter((s) => {
		if (activeFilter === 'needs_review') return s.flags !== null && !s.validatedByTeacher;
		if (activeFilter === 'validated') return s.validatedByTeacher;
		if (activeFilter === 'pending_diagnostic') return s.diagnosticStatus === 'pending';
		return true;
	});

	const chips: { id: Filter; label: () => string }[] = [
		{ id: 'all', label: () => 'All' },
		{ id: 'needs_review', label: () => `Needs review (${needsReviewCount})` },
		{ id: 'validated', label: () => `Validated (${validatedCount})` },
		{ id: 'pending_diagnostic', label: () => `Awaiting diagnostic (${pendingCount})` }
	];
</script>

<div class="p-8">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-foreground">Students</h1>
			<p class="mt-0.5 text-sm text-muted-foreground">{all.length} students · Year 5 Maple</p>
		</div>

		<a
			href="/teacher/students/add"
			class="flex items-center gap-2 rounded-[--radius] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
		>
			<UserPlus class="h-4 w-4" />
			Add Student
		</a>
	</div>

	<div class="mb-5 flex flex-wrap gap-2">
		{#each chips as chip}
			<button
				type="button"
				on:click={() => (activeFilter = chip.id)}
				class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors {activeFilter === chip.id
					? 'bg-primary text-primary-foreground'
					: 'bg-secondary text-secondary-foreground hover:bg-muted'}"
			>
				{chip.label()}
			</button>
		{/each}
	</div>

	{#if filtered.length === 0}
		<div class="flex flex-col items-center gap-3 py-16 text-center">
			<p class="text-sm font-medium text-foreground">No students match this filter.</p>
			{#if activeFilter !== 'all'}
				<button
					type="button"
					on:click={() => (activeFilter = 'all')}
					class="text-xs text-primary underline underline-offset-4"
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
					class="block rounded-[--radius] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
				>
					<StudentCard {student} anonymized={anonymizedOn} />
				</a>
			{/each}
		</div>
	{/if}
</div>
