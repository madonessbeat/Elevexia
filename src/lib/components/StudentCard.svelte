<script lang="ts">
	import type { Student, FlagSet, Flag } from '$lib/types';
	import { CheckCircle2, BookOpen, Layers, Languages, Hand, Sparkles } from 'lucide-svelte';

	let { student, anonymized = false }: { student: Student; anonymized?: boolean } = $props();

	const FLAG_KEYS: (keyof FlagSet)[] = [
		'reading_accessibility',
		'attention_chunking',
		'language_scaffolding',
		'hands_on_learning',
		'extended_challenge'
	];

	const FLAG_ICONS = {
		reading_accessibility: BookOpen,
		attention_chunking: Layers,
		language_scaffolding: Languages,
		hands_on_learning: Hand,
		extended_challenge: Sparkles
	} as const;

	const FLAG_COLORS: Record<keyof FlagSet, string> = {
		reading_accessibility: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
		attention_chunking: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400',
		language_scaffolding: 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400',
		hands_on_learning: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400',
		extended_challenge: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'
	};

	const initials = $derived(anonymized ? '#' + student.lastInitial : student.firstName[0] + student.lastInitial);
	const needsReview = $derived(student.flags !== null && !student.validatedByTeacher);

	function getLastEvidence(s: Student): number | null {
		if (!s.flags) return null;
		const ts = (Object.values(s.flags) as Flag[]).flatMap((f) => f.evidence.map((e) => e.timestamp));
		return ts.length ? Math.max(...ts) : null;
	}

	function timeAgo(ms: number): string {
		const days = Math.floor((Date.now() - ms) / 86_400_000);
		if (days === 0) return 'today';
		if (days === 1) return '1 day ago';
		return `${days} days ago`;
	}

	const lastEvidence = $derived(getLastEvidence(student));
</script>

<div
	class="relative rounded-[--radius] border border-border bg-card p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
>
	{#if student.validatedByTeacher}
		<div class="absolute right-3 top-3">
			<CheckCircle2 class="h-4 w-4 text-emerald-500" />
		</div>
	{/if}

	<div class="flex items-center gap-3">
		<div
			class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
		>
			{initials}
		</div>
		<div class="min-w-0 flex-1 pr-5">
			<div class="flex items-center gap-2">
				<p class="truncate font-medium text-foreground">
					{anonymized && student.anonymizedLabel ? student.anonymizedLabel : `${student.firstName} ${student.lastInitial}.`}
				</p>
				{#if student.diagnosticStatus === 'pending'}
					<span class="shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">
						Awaiting diagnostic
					</span>
				{:else if needsReview}
					<span
						class="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
					>
						Review
					</span>
				{/if}
			</div>
			<p class="text-xs text-muted-foreground">Year {student.yearGroup}</p>
		</div>
	</div>

	{#if student.flags}
		<div class="mt-3 flex gap-2">
			{#each FLAG_KEYS as key}
				{@const active = student.flags[key].value}
				{@const Icon = FLAG_ICONS[key]}
				<div class="relative">
					<div
						class="flex h-6 w-6 items-center justify-center rounded-full {active
							? FLAG_COLORS[key]
							: 'bg-muted text-muted-foreground/30'}"
					>
						<Icon size={12} />
					</div>
					{#if active && needsReview}
						<span class="pulse-ring absolute inset-0 rounded-full border border-primary/50"></span>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	{#if lastEvidence}
		<p class="mt-2 text-xs text-muted-foreground">assessed {timeAgo(lastEvidence)}</p>
	{/if}
</div>

