<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Lightbulb, Loader2 } from 'lucide-svelte';
	import { studentsStore } from '$lib/stores/students';
	import LessonPlanCard from '$lib/components/LessonPlanCard.svelte';
	import type { LessonPlan } from '$lib/types';

	$: toggles = $studentsStore.featureToggles;
	$: anonymizedOn = toggles.anonymizedStudents;
	$: students = $studentsStore.students;
	$: savedPlans = $studentsStore.lessonPlans;

	let objectives = '';
	let generating = false;
	let step = 0;
	let currentPlan: LessonPlan | null = null;

	const STEPS = [
		'Reading class profiles…',
		'Identifying differentiation needs…',
		'Building lesson plan…'
	];

	const FLAG_ADAPTATIONS: Record<string, string> = {
		reading_accessibility: 'Short sentences, simplified vocabulary, visual cues',
		attention_chunking: 'Content broken into 3-part chunks with checkpoints',
		language_scaffolding: 'Glossary provided, sentence frames for written tasks',
		hands_on_learning: 'Practical activity included in each section',
		extended_challenge: 'Stretch questions at DOK 3–4 appended'
	};

	async function generate() {
		if (!objectives.trim() || !toggles.lessonPlanGeneration) return;
		generating = true;
		step = 0;
		currentPlan = null;

		// Animate through steps
		for (let i = 0; i < STEPS.length; i++) {
			step = i;
			await new Promise((r) => setTimeout(r, 700));
		}

		// Build demo plan from store state
		const studentPlans = students.map((s) => {
			const activeFlags = s.flags
				? Object.entries(s.flags)
						.filter(([, f]) => f.value)
						.map(([k]) => k)
				: [];
			const adaptations = activeFlags.map((k) => FLAG_ADAPTATIONS[k] ?? k);
			const summary =
				adaptations.length > 0
					? adaptations[0]
					: 'Standard delivery — no specific adaptations needed';
			return { studentId: s.id, adaptations, summary };
		});

		currentPlan = {
			id: `plan-${Date.now()}`,
			objectives: objectives.trim(),
			classLabel: '5 Maple',
			createdAt: Date.now(),
			studentPlans
		};

		generating = false;
		step = 0;
	}

	function savePlan() {
		if (!currentPlan) return;
		studentsStore.saveLessonPlan(currentPlan);
		toast.success('Lesson plan saved. It will appear as a banner on your dashboard.');
	}
</script>

<div class="p-8">
	<div class="mb-6">
		<h1 class="font-display text-2xl font-bold text-foreground">Lesson Planner</h1>
		<p class="mt-0.5 text-sm text-muted-foreground">
			Enter your class objectives and the system will generate a differentiated lesson plan.
		</p>
	</div>

	<div class="grid gap-8 lg:grid-cols-[2fr_3fr]">
		<!-- Left: Input -->
		<div class="space-y-4">
			<div class="rounded-[--radius] border border-border bg-card p-5 space-y-4">
				<div class="space-y-1.5">
					<label for="class-select" class="text-sm font-medium text-foreground">Class</label>
					<select
						id="class-select"
						disabled
						class="w-full rounded-[--radius] border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
					>
						<option>Year 5 Maple</option>
					</select>
				</div>

				<div class="space-y-1.5">
					<label for="objectives" class="text-sm font-medium text-foreground">
						Lesson objectives
					</label>
					<textarea
						id="objectives"
						bind:value={objectives}
						placeholder="e.g. Students will be able to multiply fractions by a whole number and explain their reasoning using diagrams."
						rows={5}
						class="w-full resize-none rounded-[--radius] border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
					></textarea>
				</div>

				{#if !toggles.lessonPlanGeneration}
					<div class="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-400">
						Lesson Plan Generation is disabled.
						<a href="/teacher/settings" class="underline underline-offset-2">Enable in Settings →</a>
					</div>
				{/if}

				<button
					type="button"
					on:click={generate}
					disabled={generating || !objectives.trim() || !toggles.lessonPlanGeneration}
					class="w-full flex items-center justify-center gap-2 rounded-[--radius] bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-50"
				>
					{#if generating}
						<Loader2 class="h-4 w-4 animate-spin" />
						Generating…
					{:else}
						<Lightbulb class="h-4 w-4" />
						Generate lesson plan
					{/if}
				</button>
			</div>

			<!-- Saved plans -->
			{#if savedPlans.length > 0}
				<div class="rounded-[--radius] border border-border bg-card p-4">
					<p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
						Saved plans ({savedPlans.length})
					</p>
					{#each savedPlans as plan}
						<button
							type="button"
							on:click={() => (currentPlan = plan)}
							class="w-full text-left rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-secondary transition-colors"
						>
							"{plan.objectives.slice(0, 60)}{plan.objectives.length > 60 ? '…' : ''}"
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Right: Output -->
		<div>
			{#if generating}
				<div class="rounded-[--radius] border border-border bg-card p-8 space-y-4">
					{#each STEPS as s, i}
						<div class="flex items-center gap-3">
							<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full {i <= step ? 'bg-primary' : 'bg-muted'}">
								{#if i < step}
									<span class="text-[10px] font-bold text-primary-foreground">✓</span>
								{:else if i === step}
									<Loader2 class="h-3 w-3 animate-spin text-primary-foreground" />
								{/if}
							</div>
							<p class="text-sm {i === step ? 'font-medium text-foreground' : i < step ? 'text-muted-foreground line-through' : 'text-muted-foreground/40'}">
								{s}
							</p>
						</div>
					{/each}
				</div>
			{:else if currentPlan}
				<div class="space-y-4">
					<LessonPlanCard plan={currentPlan} anonymized={anonymizedOn} />
					<div class="flex gap-3">
						<button
							type="button"
							on:click={savePlan}
							class="rounded-[--radius] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
						>
							Save plan
						</button>
						<button
							type="button"
							on:click={() => { currentPlan = null; objectives = ''; }}
							class="rounded-[--radius] border border-border bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
						>
							Start over
						</button>
					</div>
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center rounded-[--radius] border border-dashed border-border bg-secondary/20 py-20 text-center">
					<Lightbulb class="h-10 w-10 text-muted-foreground/30 mb-3" />
					<p class="text-sm font-medium text-muted-foreground">Enter your objectives to get started</p>
					<p class="mt-1 text-xs text-muted-foreground/60">
						The plan will adapt to all {students.length} students' learning profiles.
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
