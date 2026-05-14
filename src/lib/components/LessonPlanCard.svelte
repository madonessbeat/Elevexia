<script lang="ts">
	import type { LessonPlan } from '$lib/types';
	import { studentsStore } from '$lib/stores/students';
	import FlagBadge from '$lib/components/FlagBadge.svelte';
	import type { FlagSet } from '$lib/types';

	export let plan: LessonPlan;
	export let anonymized = false;

	const FLAG_KEYS: (keyof FlagSet)[] = [
		'reading_accessibility',
		'attention_chunking',
		'language_scaffolding',
		'hands_on_learning',
		'extended_challenge'
	];

	$: students = $studentsStore.students;

	function getStudentLabel(studentId: string): string {
		const s = students.find((st) => st.id === studentId);
		if (!s) return studentId;
		if (anonymized && s.anonymizedLabel) return s.anonymizedLabel;
		return `${s.firstName} ${s.lastInitial}.`;
	}

	function getActiveFlags(studentId: string): (keyof FlagSet)[] {
		const s = students.find((st) => st.id === studentId);
		if (!s?.flags) return [];
		return FLAG_KEYS.filter((k) => s.flags![k].value);
	}
</script>

<div class="space-y-4">
	<!-- Summary -->
	<div class="rounded-[--radius] border border-border bg-card p-5">
		<p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Lesson Summary</p>
		<p class="text-sm text-foreground leading-relaxed">
			This lesson plan has been generated based on the objectives you provided and the active
			learning profiles of {plan.studentPlans.length} student{plan.studentPlans.length === 1 ? '' : 's'}
			in Class {plan.classLabel}.
		</p>
		<p class="mt-2 text-xs text-muted-foreground italic">
			Objectives: "{plan.objectives}"
		</p>
	</div>

	<!-- Per-student adaptations -->
	<div class="rounded-[--radius] border border-border bg-card overflow-hidden">
		<div class="px-5 py-3 border-b border-border bg-secondary/30">
			<p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
				Per-student adaptations
			</p>
		</div>
		<table class="w-full text-sm">
			<tbody>
				{#each plan.studentPlans as sp, i}
					{@const activeFlags = getActiveFlags(sp.studentId)}
					<tr class={i % 2 === 0 ? 'bg-card' : 'bg-secondary/20'}>
						<td class="px-5 py-3 font-medium text-foreground whitespace-nowrap">
							{getStudentLabel(sp.studentId)}
						</td>
						<td class="px-4 py-3">
							{#if activeFlags.length === 0}
								<span class="text-xs text-muted-foreground">Standard programme</span>
							{:else}
								<div class="flex flex-wrap gap-1">
									{#each activeFlags as flag}
										<FlagBadge {flag} state="active" />
									{/each}
								</div>
							{/if}
						</td>
						<td class="px-4 py-3 text-muted-foreground text-xs">{sp.summary}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
