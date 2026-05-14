<script lang="ts">
	import { toast } from 'svelte-sonner';
	import ToggleSwitch from '$lib/components/ToggleSwitch.svelte';
	import { studentsStore } from '$lib/stores/students';
	import type { FeatureToggles } from '$lib/types';

	$: toggles = $studentsStore.featureToggles;

	function setToggle(key: keyof FeatureToggles, value: boolean) {
		studentsStore.setToggle(key, value);
		toast.success(`${value ? 'Enabled' : 'Disabled'} ${key.replace(/_/g, ' ')}.`);
	}

	let resetting = false;
	function handleReset() {
		if (!resetting) {
			resetting = true;
			toast.warning('Click again to confirm reset.', { duration: 3000 });
			setTimeout(() => (resetting = false), 3500);
			return;
		}
		studentsStore.reset();
		resetting = false;
		toast.success('All demo data has been reset.');
	}
</script>

<div class="p-8 max-w-2xl">
	<h1 class="font-display text-2xl font-bold text-foreground">Settings</h1>
	<p class="mt-0.5 text-sm text-muted-foreground">Application preferences and feature controls</p>

	<!-- Feature Toggles -->
	<section class="mt-10">
		<h2 class="font-display text-base font-semibold text-foreground">Feature Toggles</h2>
		<p class="mt-1 text-sm text-muted-foreground">
			Control which intelligent features are active in your dashboard.
		</p>

		<div class="mt-4 divide-y divide-border rounded-[--radius] border border-border bg-card">
			<!-- Anonymized Students -->
			<div class="flex items-center justify-between gap-4 px-5 py-4">
				<div>
					<p class="text-sm font-medium text-foreground">Anonymized Students</p>
					<p class="mt-0.5 text-xs text-muted-foreground">
						Hide real student names. Students appear as "Class 6B – Learner 01" throughout the
						dashboard.
					</p>
				</div>
				<ToggleSwitch
					checked={toggles.anonymizedStudents}
					label="Toggle anonymized students"
					onToggle={(v) => setToggle('anonymizedStudents', v)}
				/>
			</div>

			<!-- Lesson Plan Generation -->
			<div class="flex items-center justify-between gap-4 px-5 py-4">
				<div>
					<p class="text-sm font-medium text-foreground">Lesson Plan Generation</p>
					<p class="mt-0.5 text-xs text-muted-foreground">
						Enable the AI lesson planner to generate differentiated lesson plans from your class
						objectives.
					</p>
				</div>
				<ToggleSwitch
					checked={toggles.lessonPlanGeneration}
					label="Toggle lesson plan generation"
					onToggle={(v) => setToggle('lessonPlanGeneration', v)}
				/>
			</div>

			<!-- Differentiated Materials -->
			<div class="flex items-center justify-between gap-4 px-5 py-4">
				<div>
					<p class="text-sm font-medium text-foreground">Differentiated Materials</p>
					<p class="mt-0.5 text-xs text-muted-foreground">
						Allow per-student material generation based on individual learning flags.
					</p>
				</div>
				<ToggleSwitch
					checked={toggles.differentiatedMaterials}
					label="Toggle differentiated materials"
					onToggle={(v) => setToggle('differentiatedMaterials', v)}
				/>
			</div>
		</div>
	</section>

	<!-- Account (stub) -->
	<section class="mt-10">
		<h2 class="font-display text-base font-semibold text-foreground">Account</h2>
		<div class="mt-4 divide-y divide-border rounded-[--radius] border border-border bg-card">
			<div class="flex items-center justify-between px-5 py-4">
				<div>
					<p class="text-sm font-medium text-foreground">demo@elevexia.io</p>
					<p class="mt-0.5 text-xs text-muted-foreground">Demo teacher account</p>
				</div>
				<button
					type="button"
					on:click={() => toast.info('Password change coming soon.')}
					class="text-xs text-primary hover:underline underline-offset-2"
				>
					Change password
				</button>
			</div>
		</div>
	</section>

	<!-- Danger Zone -->
	<section class="mt-10">
		<h2 class="font-display text-base font-semibold text-destructive">Demo Reset</h2>
		<p class="mt-1 text-sm text-muted-foreground">
			Reset all students, flags, and lesson plans to the original seed data.
		</p>
		<button
			type="button"
			on:click={handleReset}
			class="mt-4 rounded-[--radius] border border-destructive px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
		>
			{resetting ? 'Click again to confirm…' : 'Reset all demo data'}
		</button>
	</section>
</div>
