<script lang="ts">
	import type { Student, FlagSet } from '$lib/types';

	export let student: Student;

	const flagKeys: (keyof FlagSet)[] = [
		'reading_accessibility',
		'attention_chunking',
		'language_scaffolding',
		'hands_on_learning',
		'extended_challenge'
	];

	$: initials = student.firstName[0] + student.lastInitial;
	$: needsReview = student.flags !== null && !student.validatedByTeacher;
</script>

<div class="rounded-[--radius] border border-border bg-card p-4 shadow-sm">
	<div class="flex items-center gap-3">
		<div
			class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
		>
			{initials}
		</div>
		<div class="min-w-0 flex-1">
			<div class="flex items-center gap-2">
				<p class="truncate font-medium text-foreground">
					{student.firstName}
					{student.lastInitial}.
				</p>
				{#if needsReview}
					<span
						class="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
					>
						Needs review
					</span>
				{/if}
			</div>
			<p class="text-xs text-muted-foreground">Year {student.yearGroup}</p>
		</div>
	</div>

	{#if student.flags}
		<div class="mt-3 flex gap-1.5">
			{#each flagKeys as key}
				<span
					title={key.replace(/_/g, ' ')}
					class="h-2 w-2 rounded-full {student.flags[key].value
						? 'bg-primary'
						: 'bg-muted-foreground/30'}"
				/>
			{/each}
		</div>
	{/if}
</div>
