<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { Users, ClipboardCheck, FileText, GraduationCap } from 'lucide-svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import { schoolStore } from '$lib/stores/school';
	import { toast } from 'svelte-sonner';

	$: stats = $schoolStore.stats;
	$: teachers = $schoolStore.teachers;

	// Animated counters
	const totalStudents = tweened(0, { duration: 900, easing: cubicOut });
	const assessments = tweened(0, { duration: 900, easing: cubicOut });
	const materials = tweened(0, { duration: 900, easing: cubicOut });
	const teacherCount = tweened(0, { duration: 900, easing: cubicOut });

	onMount(() => {
		totalStudents.set(stats.totalStudents);
		assessments.set(stats.assessmentsCompleted);
		materials.set(stats.materialsGenerated);
		teacherCount.set(stats.teacherCount);
	});

	function statusColor(daysAgo: number): string {
		if (daysAgo <= 7) return 'bg-emerald-500';
		if (daysAgo <= 30) return 'bg-amber-400';
		return 'bg-muted-foreground/30';
	}

	function statusLabel(daysAgo: number): string {
		if (daysAgo === 0) return 'Active today';
		if (daysAgo === 1) return 'Active yesterday';
		return `Active ${daysAgo} days ago`;
	}

	const AVATAR_COLORS = [
		'bg-indigo-100 text-indigo-700',
		'bg-violet-100 text-violet-700',
		'bg-blue-100 text-blue-700',
		'bg-teal-100 text-teal-700',
		'bg-slate-100 text-slate-700'
	];
</script>

<!-- Hero banner -->
<div class="relative overflow-hidden bg-gradient-to-br from-[hsl(232,60%,30%)] via-[hsl(240,52%,38%)] to-[hsl(246,44%,48%)] px-8 py-14 text-white">
	<div class="relative z-10 mx-auto max-w-7xl">
		<p class="font-display text-4xl font-bold tracking-tight">Elevexia</p>
		<p class="mt-2 text-sm font-medium tracking-widest uppercase opacity-75">Knowledge Empowers</p>
		<p class="mt-4 max-w-md text-sm opacity-80 leading-relaxed">
			Intelligent adaptive learning platform — giving every student the teaching they need.
		</p>
	</div>
	<!-- Decorative circles -->
	<div class="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5"></div>
	<div class="absolute -bottom-20 right-24 h-96 w-96 rounded-full bg-white/5"></div>
</div>

<div class="mx-auto max-w-7xl px-6 py-10">
	<!-- Stats row -->
	<div class="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<StatCard label="Total Students" value={Math.round($totalStudents)} Icon={Users} iconClass="text-primary" />
		<StatCard label="Assessments Completed" value={Math.round($assessments)} Icon={ClipboardCheck} iconClass="text-emerald-600" />
		<StatCard label="Materials Generated" value={Math.round($materials)} Icon={FileText} iconClass="text-violet-600" />
		<StatCard label="Active Teachers" value={Math.round($teacherCount)} Icon={GraduationCap} iconClass="text-amber-600" />
	</div>

	<!-- Teacher grid -->
	<div class="mb-4 flex items-center justify-between">
		<h2 class="font-display text-lg font-semibold text-foreground">Teaching Staff</h2>
		<span class="text-xs text-muted-foreground">Administrative view — read only</span>
	</div>

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each teachers as teacher, i}
			<button
				type="button"
				on:click={() => toast.info('Administrative view only — no editing available.')}
				class="group text-left rounded-[--radius] border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md cursor-default"
			>
				<div class="flex items-center gap-3 mb-4">
					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full {AVATAR_COLORS[i % AVATAR_COLORS.length]} font-semibold text-sm">
						{teacher.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
					</div>
					<div class="min-w-0 flex-1">
						<p class="font-medium text-foreground truncate">{teacher.name}</p>
						<p class="text-xs text-muted-foreground">{teacher.subject}</p>
					</div>
					<span class="h-2.5 w-2.5 shrink-0 rounded-full {statusColor(teacher.lastActiveDaysAgo)}" title={statusLabel(teacher.lastActiveDaysAgo)}></span>
				</div>

				<div class="flex flex-wrap gap-1 mb-3">
					{#each teacher.yearGroups as yg}
						<span class="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{yg}</span>
					{/each}
				</div>

				<div class="flex items-center justify-between text-xs text-muted-foreground">
					<span>{teacher.studentCount} students</span>
					<span>{statusLabel(teacher.lastActiveDaysAgo)}</span>
				</div>
			</button>
		{/each}
	</div>
</div>
