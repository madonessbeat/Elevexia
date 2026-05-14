<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import { studentsStore } from '$lib/stores/students';
	import DiagnosticCodeDisplay from '$lib/components/DiagnosticCodeDisplay.svelte';
	import { PlayCircle } from 'lucide-svelte';

	$: id = $page.params.id ?? '';
	$: student = $studentsStore.students.find((s) => s.id === id);
	$: anonymizedOn = $studentsStore.featureToggles.anonymizedStudents;
	$: studentLabel = student
		? anonymizedOn && student.anonymizedLabel
			? student.anonymizedLabel
			: `${student.firstName} ${student.lastInitial}.`
		: 'Student';

	let simulating = false;

	function simulateCompletion() {
		if (!student) return;
		simulating = true;
		setTimeout(() => {
			studentsStore.markDiagnosticComplete(id);
			toast.success('Assessment results loaded. Flags have been assigned.');
			goto(`/teacher/student/${id}`);
		}, 800);
	}
</script>

<div class="p-8 max-w-xl">
	<div class="mb-6">
		<a href="/teacher/students" class="text-sm text-muted-foreground hover:text-primary">
			← Back to Students
		</a>
		<h1 class="font-display mt-3 text-2xl font-bold text-foreground">Send Diagnostic</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Share the code below with <span class="font-medium text-foreground">{studentLabel}</span>.
			Their results will appear automatically once they complete the assessment.
		</p>
	</div>

	{#if student}
		<div class="space-y-4">
			<DiagnosticCodeDisplay
				code={student.diagnosticCode ?? '------'}
				{studentLabel}
				onCopy={() => toast.success('Link copied to clipboard!')}
			/>

			<!-- Steps -->
			<div class="rounded-[--radius] border border-border bg-card p-5 space-y-3">
				<p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What happens next</p>
				{#each [
					'Student opens the link or enters the code at elevexia.io/student',
					'They complete a 10-question survey and 10-question quiz (10–15 min)',
					'The system evaluates their responses and assigns learning flags',
					'You review and validate the flags on their profile'
				] as step, i}
					<div class="flex items-start gap-3">
						<span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
						<p class="text-sm text-muted-foreground">{step}</p>
					</div>
				{/each}
			</div>

			<!-- Simulate completion (demo) -->
			<div class="rounded-[--radius] border border-dashed border-amber-300 bg-amber-50/60 p-4 dark:border-amber-800 dark:bg-amber-950/20">
				<p class="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">Demo mode</p>
				<p class="text-xs text-muted-foreground mb-3">
					In production, results load automatically. For this demo, click below to simulate the
					student completing their assessment.
				</p>
				<button
					type="button"
					on:click={simulateCompletion}
					disabled={simulating}
					class="inline-flex items-center gap-2 rounded-[--radius] bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-amber-700"
				>
					<PlayCircle class="h-4 w-4" />
					{simulating ? 'Loading results…' : 'Simulate completion'}
				</button>
			</div>
		</div>
	{:else}
		<div class="rounded-[--radius] border border-border bg-card p-8 text-center">
			<p class="text-sm text-muted-foreground">Student not found.</p>
			<a href="/teacher/students" class="mt-3 inline-block text-sm text-primary underline">
				Back to Students
			</a>
		</div>
	{/if}
</div>
