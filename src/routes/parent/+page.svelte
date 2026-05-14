<script lang="ts">
	import { parentStore } from '$lib/stores/parent';
	import ParentFlagInsight from '$lib/components/ParentFlagInsight.svelte';
	import ProgressTimeline from '$lib/components/ProgressTimeline.svelte';
	import { CheckCircle2, Clock } from 'lucide-svelte';

	$: children = $parentStore.children;

	function formatDate(ts: number | null): string {
		if (!ts) return 'Not yet assessed';
		const days = Math.floor((Date.now() - ts) / 86_400_000);
		if (days === 0) return 'Assessed today';
		if (days === 1) return 'Assessed yesterday';
		return `Assessed ${days} days ago`;
	}
</script>

<div class="mx-auto max-w-4xl px-6 py-10">
	<!-- Welcome -->
	<div class="mb-8">
		<h1 class="font-display text-2xl font-bold text-foreground">Welcome back</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Here's how your child/children are getting on with Elevexia.
		</p>
	</div>

	<!-- Child cards -->
	<div class="space-y-6">
		{#each children as child}
			<div class="rounded-[--radius] border border-border bg-card shadow-sm overflow-hidden">
				<!-- Card header -->
				<div class="border-b border-border bg-secondary/30 px-6 py-4">
					<div class="flex items-center justify-between">
						<div>
							<p class="font-display text-base font-semibold text-foreground">{child.anonymizedLabel}</p>
							<p class="mt-0.5 text-xs text-muted-foreground">{formatDate(child.assessmentDate)}</p>
						</div>
						{#if child.assessmentDate}
							<span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
								<CheckCircle2 class="h-3.5 w-3.5" />
								Assessment complete
							</span>
						{:else}
							<span class="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
								<Clock class="h-3.5 w-3.5" />
								Assessment pending
							</span>
						{/if}
					</div>
				</div>

				<div class="grid gap-6 p-6 sm:grid-cols-[1fr_auto]">
					<!-- Learning profile -->
					<div>
						<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Learning profile
						</p>
						<ParentFlagInsight flags={child.flags} />
					</div>

					<!-- Timeline -->
					{#if child.progressTimeline.length > 0}
						<div class="sm:border-l sm:border-border sm:pl-6 sm:min-w-[200px]">
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								Recent activity
							</p>
							<ProgressTimeline events={child.progressTimeline} />
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>

	<!-- Reassurance note -->
	<div class="mt-8 rounded-[--radius] border border-border bg-card/60 px-5 py-4">
		<p class="text-xs text-muted-foreground leading-relaxed">
			Your child's teacher reviews all information before any materials are generated. Learning
			profiles are updated automatically after each assessment. Contact the school for more details
			or to discuss your child's progress.
		</p>
	</div>
</div>
