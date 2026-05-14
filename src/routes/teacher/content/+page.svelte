<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { FileText, Download } from 'lucide-svelte';
	import { studentsStore } from '$lib/stores/students';

	$: anonymizedOn = $studentsStore.featureToggles.anonymizedStudents;

	const DEMO_MATERIALS = [
		{ studentId: 'stu-a', studentName: 'Marcus T.', anonymizedLabel: 'Class 5M – Learner 01', topic: 'Fractions', generatedDaysAgo: 1 },
		{ studentId: 'stu-b', studentName: 'Amara D.', anonymizedLabel: 'Class 5M – Learner 02', topic: 'Fractions', generatedDaysAgo: 1 },
		{ studentId: 'stu-c', studentName: 'Jake P.', anonymizedLabel: 'Class 5M – Learner 03', topic: 'Long Division', generatedDaysAgo: 2 }
	];
</script>

<div class="p-8">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-foreground">Content</h1>
			<p class="mt-0.5 text-sm text-muted-foreground">Worksheet library and generated materials</p>
		</div>
		<a
			href="/teacher/student/stu-a"
			class="flex items-center gap-2 rounded-[--radius] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
		>
			<FileText class="h-4 w-4" />
			Generate new material
		</a>
	</div>

	<div class="space-y-3">
		{#each DEMO_MATERIALS as item}
			<div class="flex items-center gap-4 rounded-[--radius] border border-border bg-card px-5 py-4">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
					<FileText class="h-4 w-4 text-primary" />
				</div>
				<div class="flex-1 min-w-0">
					<p class="font-medium text-foreground truncate">
						{anonymizedOn ? item.anonymizedLabel : item.studentName} — {item.topic}
					</p>
					<p class="text-xs text-muted-foreground mt-0.5">
						Generated {item.generatedDaysAgo === 1 ? 'yesterday' : `${item.generatedDaysAgo} days ago`}
					</p>
				</div>
				<button
					type="button"
					on:click={() => toast.info('Download available in production.')}
					class="flex items-center gap-2 rounded-[--radius] border border-border bg-secondary px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
				>
					<Download class="h-3.5 w-3.5" />
					Download
				</button>
			</div>
		{/each}
	</div>
</div>
