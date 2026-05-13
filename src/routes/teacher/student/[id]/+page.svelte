<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { Select } from 'bits-ui';
	import { ChevronLeft, Check, Shuffle, ChevronDown } from 'lucide-svelte';
	import FlagBadge from '$lib/components/FlagBadge.svelte';
	import EvidenceList from '$lib/components/EvidenceList.svelte';
	import OverrideDialog from '$lib/components/OverrideDialog.svelte';
	import { studentsStore, FLAG_KEYS } from '$lib/stores/students';
	import type { FlagSet } from '$lib/types';

	const FLAG_LABELS: Record<keyof FlagSet, string> = {
		reading_accessibility: 'Reading Accessibility',
		attention_chunking: 'Attention Chunking',
		language_scaffolding: 'Language Scaffolding',
		hands_on_learning: 'Hands-on Learning',
		extended_challenge: 'Extended Challenge'
	};

	const studentId = $derived(page.params.id ?? '');
	const student = $derived($studentsStore.students.find((s) => s.id === studentId));
	const overridden = $derived(new Set($studentsStore.overriddenFlags[studentId] ?? []));
	const confirmed = $derived(new Set($studentsStore.confirmedFlags[studentId] ?? []));
	const activeFlagKeys = $derived(
		student?.flags ? FLAG_KEYS.filter((k) => student!.flags![k].value) : []
	);

	function flagState(flag: keyof FlagSet): 'active' | 'overridden' | 'inactive' {
		if (!student?.flags) return 'inactive';
		if (overridden.has(flag)) return 'overridden';
		return student.flags[flag].value ? 'active' : 'inactive';
	}

	function isFlagConfirmed(flag: keyof FlagSet): boolean {
		return !!(student?.validatedByTeacher || confirmed.has(flag));
	}

	// ── Override dialog ────────────────────────────────────────────
	let overrideOpen = $state(false);
	let overrideFlag: keyof FlagSet | null = $state(null);

	function openOverride(flag: keyof FlagSet) {
		overrideFlag = flag;
		overrideOpen = true;
	}

	function handleOverrideConfirm(reason: string) {
		if (!overrideFlag) return;
		studentsStore.overrideFlag(studentId, overrideFlag, reason);
		overrideOpen = false;
		overrideFlag = null;
		toast.success('Flag overridden successfully');
	}

	function handleOverrideCancel() {
		overrideOpen = false;
		overrideFlag = null;
	}

	// ── Validate ──────────────────────────────────────────────────
	function handleValidate(flag: keyof FlagSet) {
		studentsStore.confirmFlag(studentId, flag);
		toast.success(`${FLAG_LABELS[flag]} confirmed`);
	}

	// ── Material generation ───────────────────────────────────────
	const subjects = [
		{ value: 'maths', label: 'Maths', disabled: false },
		{ value: 'english', label: 'English (coming soon)', disabled: true },
		{ value: 'science', label: 'Science (coming soon)', disabled: true }
	];

	let selectedSubject: { value: string; label?: string } = $state({ value: 'maths', label: 'Maths' });
	let topic = $state('');

	function handleGenerate() {
		if (!topic.trim()) return;
		goto(`/teacher/material/${studentId}?topic=${encodeURIComponent(topic.trim())}`);
	}
</script>

{#if !student}
	<div class="p-8">
		<p class="text-muted-foreground">Student not found.</p>
		<a href="/teacher" class="mt-2 inline-block text-sm text-primary underline underline-offset-4">
			Back to dashboard
		</a>
	</div>
{:else}
	<div class="p-8">
		<!-- Back link -->
		<a
			href="/teacher"
			class="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
		>
			<ChevronLeft class="h-4 w-4" />
			All students
		</a>

		<!-- Page header -->
		<div class="mb-8 flex items-center gap-4">
			<div
				class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary"
			>
				{student.firstName[0]}{student.lastInitial}
			</div>
			<div>
				<h1 class="font-display text-2xl font-bold text-foreground">
					{student.firstName}
					{student.lastInitial}.
				</h1>
				<p class="text-sm text-muted-foreground">
					Year {student.yearGroup}
					{#if student.validatedByTeacher}
						<span class="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
							Validated
						</span>
					{:else}
						<span class="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
							Needs review
						</span>
					{/if}
				</p>
			</div>
		</div>

		<!-- Two-column body -->
		<div class="grid grid-cols-5 gap-8">
			<!-- Left 60%: flag rows -->
			<div class="col-span-3">
				<h2 class="mb-4 font-display text-base font-semibold text-foreground">Learning flags</h2>

				{#if student.flags}
					<div class="divide-y divide-border rounded-[--radius] border border-border bg-card">
						{#each FLAG_KEYS as flagKey}
							{@const flagData = student.flags[flagKey]}
							<div class="p-4">
								<div class="flex items-center justify-between gap-3">
									<FlagBadge flag={flagKey} state={flagState(flagKey)} />

									<div class="flex shrink-0 items-center gap-2">
										<button
											type="button"
											disabled={isFlagConfirmed(flagKey)}
											onclick={() => handleValidate(flagKey)}
											class="inline-flex items-center gap-1.5 rounded-[--radius] border border-border bg-secondary px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-50"
											title={isFlagConfirmed(flagKey) ? 'Already confirmed' : 'Confirm this assessment'}
										>
											{#if isFlagConfirmed(flagKey)}
												<Check class="h-3 w-3 text-primary" />
												Confirmed
											{:else}
												Validate
											{/if}
										</button>
										<button
											type="button"
											onclick={() => openOverride(flagKey)}
											class="inline-flex items-center gap-1.5 rounded-[--radius] border border-border bg-secondary px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
										>
											<Shuffle class="h-3 w-3" />
											Override
										</button>
									</div>
								</div>

								{#if flagData.evidence.length > 0}
									<div class="mt-3">
										<EvidenceList items={flagData.evidence} />
									</div>
								{:else}
									<p class="mt-2 text-xs text-muted-foreground">No evidence recorded.</p>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Right 40%: material generation -->
			<div class="col-span-2">
				<h2 class="mb-4 font-display text-base font-semibold text-foreground">
					Generate adapted worksheet
				</h2>

				<div class="space-y-4 rounded-[--radius] border border-border bg-card p-5">
					<div class="space-y-1.5">
						<label for="subject-trigger" class="text-sm font-medium text-foreground">Subject</label>
						<Select.Root
							selected={selectedSubject}
							onSelectedChange={(v) => { if (v) selectedSubject = v; }}
						>
							<Select.Trigger
								id="subject-trigger"
								class="flex w-full items-center justify-between rounded-[--radius] border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								<Select.Value placeholder="Select subject…" />
								<ChevronDown class="h-4 w-4 shrink-0 text-muted-foreground" />
							</Select.Trigger>
							<Select.Content
								class="z-50 min-w-[8rem] overflow-hidden rounded-[--radius] border border-border bg-popover shadow-md"
								sideOffset={4}
							>
								{#each subjects as s}
									<Select.Item
										value={s.value}
										label={s.label}
										disabled={s.disabled}
										class="flex cursor-pointer select-none items-center px-3 py-2 text-sm outline-none data-[disabled]:cursor-not-allowed data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50"
									>
										{s.label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<div class="space-y-1.5">
						<label for="topic" class="text-sm font-medium text-foreground">Topic</label>
						<input
							id="topic"
							type="text"
							bind:value={topic}
							placeholder="e.g. fractions, long division…"
							class="w-full rounded-[--radius] border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						/>
					</div>

					<button
						type="button"
						disabled={!topic.trim()}
						onclick={handleGenerate}
						class="w-full rounded-[--radius] bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
					>
						Generate →
					</button>

					<p class="text-xs text-muted-foreground">
						The worksheet will be adapted to {student.firstName}'s learning profile automatically.
					</p>
				</div>

				<!-- Active flags summary -->
				{#if activeFlagKeys.length > 0}
					<div class="mt-4 space-y-2 rounded-[--radius] bg-accent p-4">
						<p class="text-xs font-medium text-accent-foreground">Adaptations will include:</p>
						<div class="flex flex-wrap gap-1.5">
							{#each activeFlagKeys as flag}
								<FlagBadge {flag} state={flagState(flag)} />
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Override dialog -->
	{#if overrideFlag && student.flags}
		{@const activeFlag = overrideFlag}
		<OverrideDialog
			open={overrideOpen}
			flag={activeFlag}
			currentValue={student.flags[activeFlag].value}
			onConfirm={handleOverrideConfirm}
			onCancel={handleOverrideCancel}
		/>
	{/if}
{/if}
