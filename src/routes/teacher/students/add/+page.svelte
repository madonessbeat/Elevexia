<script lang="ts">
	import { goto } from '$app/navigation';
	import { studentsStore } from '$lib/stores/students';
	import { toast } from 'svelte-sonner';

	let classLabel = '';
	let yearGroup: 4 | 5 | 6 = 5;
	let submitting = false;

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!classLabel.trim()) return;
		submitting = true;
		const id = studentsStore.addStudent(classLabel.trim().toUpperCase(), yearGroup);
		toast.success('Student added. Send them the diagnostic link.');
		goto(`/teacher/students/diagnostic/${id}`);
	}
</script>

<div class="p-8 max-w-lg">
	<div class="mb-6">
		<a href="/teacher/students" class="text-sm text-muted-foreground hover:text-primary">
			← Back to Students
		</a>
		<h1 class="font-display mt-3 text-2xl font-bold text-foreground">Add a Student</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Students are anonymized by default. After adding, you'll receive a diagnostic link to share
			with them.
		</p>
	</div>

	<form on:submit={handleSubmit} class="space-y-5 rounded-[--radius] border border-border bg-card p-6">
		<div class="space-y-1.5">
			<label for="class-label" class="text-sm font-medium text-foreground">
				Class label <span class="text-muted-foreground font-normal">(e.g. 6B, 5 Maple)</span>
			</label>
			<input
				id="class-label"
				type="text"
				bind:value={classLabel}
				placeholder="6B"
				maxlength="10"
				required
				class="w-full rounded-[--radius] border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
			/>
		</div>

		<div class="space-y-1.5">
			<label for="year-group" class="text-sm font-medium text-foreground">Year group</label>
			<select
				id="year-group"
				bind:value={yearGroup}
				class="w-full rounded-[--radius] border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
			>
				<option value={4}>Year 4</option>
				<option value={5}>Year 5</option>
				<option value={6}>Year 6</option>
			</select>
		</div>

		<div class="rounded-md bg-secondary/60 px-4 py-3 text-xs text-muted-foreground">
			The student will appear as <span class="font-semibold text-foreground">
				Class {classLabel.toUpperCase() || '??'} – Learner NN
			</span> in your dashboard.
		</div>

		<button
			type="submit"
			disabled={submitting || !classLabel.trim()}
			class="w-full rounded-[--radius] bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-50"
		>
			{submitting ? 'Adding…' : 'Add student & get diagnostic link'}
		</button>
	</form>
</div>
