<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { untrack } from 'svelte';
	import { page } from '$app/state';
	import { dev } from '$app/environment';
	import { toast } from 'svelte-sonner';
	import {
		ChevronLeft,
		Sparkles,
		Download,
		RefreshCw,
		CheckCircle2,
		UserRound,
		ListOrdered,
		Wand2,
		FileText
	} from 'lucide-svelte';
	import FlagBadge from '$lib/components/FlagBadge.svelte';
	import { studentsStore, FLAG_KEYS } from '$lib/stores/students';
	import type { FlagSet } from '$lib/types';
	import { buildDocDef, WORKSHEET_FONTS } from '$lib/pdf/docdef';
	import type { WorksheetData } from '$lib/pdf/docdef';

	// ── Route ─────────────────────────────────────────────────────
	const studentId = $derived(page.params.studentId);
	const topic = $derived(page.url.searchParams.get('topic') ?? '');
	const student = $derived($studentsStore.students.find((s) => s.id === studentId));
	const activeFlags = $derived(
		student?.flags
			? (FLAG_KEYS.filter((k) => student!.flags![k].value) as (keyof FlagSet)[])
			: ([] as (keyof FlagSet)[])
	);

	// ── Generation state ──────────────────────────────────────────
	let pdfUrl = $state<string | null>(null);
	let errorMsg = $state('');
	let apiDone = $state(false);

	// ── Timer ─────────────────────────────────────────────────────
	let timerStart = $state(Date.now());
	let elapsed = $state(0);
	let ffActive = false; // plain JS — shared across effect closures

	const currentStep = $derived.by(() => {
		if (elapsed < 3000) return 1;
		if (elapsed < 8000) return 2;
		if (elapsed < 15000) return 3;
		return 4;
	});

	const done = $derived(apiDone && currentStep >= 4);

	// Real-time tick — restarts when timerStart changes (generate reset)
	$effect(() => {
		const start = timerStart;
		const id = setInterval(() => {
			if (ffActive) return;
			const t = Date.now() - start;
			if (t > elapsed) elapsed = t;
		}, 100);
		return () => clearInterval(id);
	});

	// Fast-forward elapsed → 16 000 when API resolves before step 4
	$effect(() => {
		if (!apiDone) return;
		const cur = untrack(() => elapsed);
		if (cur >= 15000) return;

		ffActive = true;
		const from = cur;
		const to = 16000;
		const duration = 1500;
		const start = performance.now();
		let rafId: number;

		function tick(now: number) {
			const t = Math.min((now - start) / duration, 1);
			elapsed = from + (to - from) * (1 - Math.pow(1 - t, 3));
			if (t < 1) rafId = requestAnimationFrame(tick);
			else ffActive = false;
		}

		rafId = requestAnimationFrame(tick);
		return () => {
			cancelAnimationFrame(rafId);
			ffActive = false;
		};
	});

	// ── Question-count tween ──────────────────────────────────────
	const questionCount = tweened(0, { duration: 4000, easing: cubicOut });

	$effect(() => {
		if (currentStep === 2) questionCount.set(10);
	});

	// ── Steps config ──────────────────────────────────────────────
	const steps = $derived([
		{
			label: `Reading ${student?.firstName ?? 'student'}'s profile`,
			detail: 'Analysing learning flags and prior evidence',
			icon: UserRound
		},
		{
			label: 'Selecting questions at the right level',
			detail: 'Matching DOK levels to assessment data',
			icon: ListOrdered
		},
		{
			label: 'Adapting language and layout',
			detail: 'Applying scaffolds, chunking, and glossary',
			icon: Wand2
		},
		{
			label: 'Rendering PDF',
			detail: 'Typesetting and formatting the worksheet',
			icon: FileText
		}
	]);

	// ── Generate ──────────────────────────────────────────────────
	async function generate() {
		if (!student || !topic) return;

		if (pdfUrl) {
			URL.revokeObjectURL(pdfUrl);
			pdfUrl = null;
		}
		apiDone = false;
		errorMsg = '';
		ffActive = false;
		elapsed = 0;
		timerStart = Date.now();
		questionCount.set(0, { duration: 0 });

		try {
			// In dev, enforce a 20 s minimum so the full narrated experience plays
			const minWait = dev ? new Promise<void>((r) => setTimeout(r, 20_000)) : Promise.resolve();

			const res = await fetch('/api/generate-material', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ topic, activeFlags, student })
			});

			if (!res.ok) {
				let msg = `HTTP ${res.status}`;
				try {
					const data = await res.json();
					msg = data.message ?? msg;
				} catch {
					msg = (await res.text().catch(() => '')) || msg;
				}
				throw new Error(msg);
			}

			const worksheetData: WorksheetData = await res.json();
			await minWait;

			// Render PDF in the browser — instant, no server timeout risk
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const pdfMakeModule = await import('pdfmake/build/pdfmake' as any);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const pdfMake = (pdfMakeModule.default ?? pdfMakeModule) as any;
			const docDef = buildDocDef(worksheetData, student, student.flags ?? null);
			const blob = await new Promise<Blob>((resolve, reject) => {
				pdfMake.createPdf(docDef, null, WORKSHEET_FONTS).getBlob(
					(b: Blob) => (b ? resolve(b) : reject(new Error('PDF blob was empty')))
				);
			});

			pdfUrl = URL.createObjectURL(blob);
			apiDone = true;
		} catch (e) {
			errorMsg = e instanceof Error ? e.message : 'Generation failed';
			toast.error('Generation failed.', {
				action: { label: 'Retry', onClick: () => generate() }
			});
		}
	}

	function handleDownload() {
		if (!pdfUrl || !student) return;
		const a = document.createElement('a');
		a.href = pdfUrl;
		a.download = `worksheet-${student.firstName.toLowerCase()}-${topic.replace(/\s+/g, '-')}.pdf`;
		a.click();
	}

	// Kick off on mount — untrack prevents reactive re-triggers
	$effect(() => {
		untrack(() => generate());
	});
</script>

{#if !student}
	<div class="p-8">
		<p class="text-muted-foreground">Student not found.</p>
		<a href="/teacher" class="mt-2 inline-block text-sm text-primary underline underline-offset-4">
			Back to dashboard
		</a>
	</div>
{:else}
	<div class="flex h-full flex-col p-8">
		<!-- Back link -->
		<a
			href="/teacher/student/{studentId}"
			class="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
		>
			<ChevronLeft class="h-4 w-4" />
			Back to profile
		</a>

		<!-- Header -->
		<div class="mb-6 flex items-start justify-between gap-4">
			<div>
				<h1 class="font-display text-2xl font-bold text-foreground">Adapted Worksheet</h1>
				<p class="mt-1 text-sm text-muted-foreground">
					For {student.firstName}
					{student.lastInitial}. · Maths ·
					<span class="font-medium text-foreground">{topic}</span>
				</p>
			</div>
			<div class="flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-3 py-1.5">
				<Sparkles class="h-3.5 w-3.5 text-accent-foreground" />
				<span class="text-xs font-medium text-accent-foreground">AI generation</span>
			</div>
		</div>

		<!-- Main grid -->
		<div class="grid min-h-0 flex-1 grid-cols-5 gap-6">
			<!-- ── Left 3/5: generation experience or PDF ── -->
			<div class="col-span-3 flex flex-col">

				<!-- Loading experience -->
				{#if !done && !errorMsg}
					<div
						out:fade={{ duration: 300 }}
						class="relative flex flex-1 flex-col overflow-hidden rounded-[--radius] border border-border bg-secondary/30"
					>
						<!-- Step 3+: ghost worksheet preview materialises in background -->
						{#if currentStep >= 3}
							<div
								in:fly={{ y: 24, duration: 500 }}
								class="absolute inset-6 {currentStep >= 4
									? 'page-flip'
									: ''} rounded-lg border border-border bg-card shadow-sm"
								style="opacity: 0.18; z-index: 0"
							>
								<div class="space-y-2 p-6">
									{#each Array(9) as _, li}
										<div
											class="h-1.5 rounded-full bg-muted"
											style="width: {[100, 88, 72, 96, 80, 64, 92, 76, 60][li]}%"
										></div>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Steps list — foreground -->
						<div
							class="relative flex flex-1 items-center justify-center p-8"
							style="z-index: 1"
						>
							<div class="w-full max-w-sm space-y-4">
								{#each steps as step, i}
									{#if currentStep >= i + 1}
										{@const isCompleted = i + 1 < currentStep}
										{@const isCurrent = i + 1 === currentStep}
										<div
											in:fly={{ x: -20, duration: 300 }}
											class="flex items-start gap-3"
										>
											<!-- Icon -->
											<div class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
												{#if isCompleted}
													<CheckCircle2 class="h-5 w-5 text-emerald-500" />
												{:else}
													{@const Icon = step.icon}
													<Icon class="h-5 w-5 text-primary" />
												{/if}
											</div>

											<!-- Text -->
											<div class="min-w-0 flex-1">
												<p
													class="text-sm font-medium {isCompleted
														? 'text-muted-foreground line-through'
														: 'text-foreground'}"
												>
													{step.label}
												</p>
												{#if isCurrent}
													<p class="mt-0.5 animate-pulse text-xs text-muted-foreground">
														{step.detail}
													</p>
												{/if}

												<!-- Step 1: flag chips fly in one-by-one -->
												{#if i === 0 && activeFlags.length > 0}
													<div class="mt-2 flex flex-wrap gap-1.5">
														{#each activeFlags as flag, fi}
															<span
																in:fly={{ x: -12, duration: 240, delay: fi * 160 }}
															>
																<FlagBadge {flag} state="active" />
															</span>
														{/each}
													</div>
												{/if}

												<!-- Step 2: tweened question counter -->
												{#if i === 1 && currentStep >= 2}
													<div
														in:fly={{ x: -12, duration: 280, delay: 100 }}
														class="mt-2 flex items-baseline gap-1.5"
													>
														<span
															class="font-display text-3xl font-bold tabular-nums text-primary"
														>
															{Math.round($questionCount)}
														</span>
														<span class="text-xs text-muted-foreground">
															question{Math.round($questionCount) === 1 ? '' : 's'} selected
														</span>
													</div>
												{/if}
											</div>
										</div>
									{/if}
								{/each}
							</div>
						</div>
					</div>
				{/if}

				<!-- PDF view -->
				{#if done && pdfUrl}
					<div in:fade={{ duration: 300, delay: 300 }} class="flex flex-1">
						<iframe
							src={pdfUrl}
							title="Generated worksheet"
							class="flex-1 rounded-[--radius] border border-border bg-white shadow-sm"
							style="min-height: 600px"
						></iframe>
					</div>
				{/if}

				<!-- Error state -->
				{#if errorMsg}
					<div
						in:fade={{ duration: 200 }}
						class="flex flex-1 items-center justify-center rounded-[--radius] border border-destructive/30 bg-destructive/5"
					>
						<div class="flex flex-col items-center gap-3 px-8 text-center">
							<p class="text-sm font-medium text-destructive">Generation failed</p>
							<p class="text-xs text-muted-foreground">{errorMsg}</p>
							<button
								type="button"
								onclick={generate}
								class="mt-1 inline-flex items-center gap-1.5 rounded-[--radius] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
							>
								<RefreshCw class="h-3.5 w-3.5" />
								Try again
							</button>
						</div>
					</div>
				{/if}
			</div>

			<!-- ── Right 2/5: sidebar ── -->
			<div class="col-span-2 space-y-4">
				<!-- Actions -->
				<div class="space-y-2">
					<button
						type="button"
						disabled={!done}
						onclick={handleDownload}
						class="inline-flex w-full items-center justify-center gap-2 rounded-[--radius] bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
					>
						<Download class="h-4 w-4" />
						Download PDF
					</button>
					<button
						type="button"
						disabled={!done && !errorMsg}
						onclick={generate}
						class="inline-flex w-full items-center justify-center gap-2 rounded-[--radius] border border-border bg-secondary px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-40"
					>
						<RefreshCw class="h-4 w-4 {!apiDone && !errorMsg ? 'animate-spin' : ''}" />
						{!apiDone && !errorMsg ? 'Generating…' : 'Regenerate'}
					</button>
				</div>

				<!-- Student info -->
				<div class="space-y-2 rounded-[--radius] border border-border bg-card p-4">
					<p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Student</p>
					<div class="flex items-center gap-3">
						<div
							class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
						>
							{student.firstName[0]}{student.lastInitial}
						</div>
						<div>
							<p class="text-sm font-medium text-foreground">
								{student.firstName}
								{student.lastInitial}.
							</p>
							<p class="text-xs text-muted-foreground">Year {student.yearGroup}</p>
						</div>
					</div>
				</div>

				<!-- Active adaptations -->
				{#if activeFlags.length > 0}
					<div class="space-y-3 rounded-[--radius] border border-border bg-card p-4">
						<p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
							Applied adaptations
						</p>
						<div class="flex flex-wrap gap-2">
							{#each activeFlags as flag}
								<FlagBadge {flag} state="active" />
							{/each}
						</div>
					</div>
				{:else}
					<div class="rounded-[--radius] border border-border bg-card p-4">
						<p class="text-xs text-muted-foreground">
							No active adaptations — standard Year {student.yearGroup} level.
						</p>
					</div>
				{/if}

				<!-- Progress indicator while generating -->
				{#if !done && !errorMsg}
					<div class="space-y-1.5 rounded-[--radius] border border-border bg-card p-4">
						<div class="flex items-center justify-between text-xs text-muted-foreground">
							<span>Step <span class="tabular-nums">{currentStep}</span> of 4</span>
							<span class="tabular-nums">{Math.min(Math.round((elapsed / 16000) * 100), 99)}%</span>
						</div>
						<div class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
							<div
								class="h-1.5 rounded-full bg-primary transition-all duration-500"
								style="width: {Math.min((elapsed / 16000) * 100, 99)}%"
							></div>
						</div>
					</div>
				{/if}

				{#if done}
					<p class="text-xs text-muted-foreground">
						Generated with Gemini · Adapted to {student.firstName}'s learning profile
					</p>
				{/if}
			</div>
		</div>
	</div>
{/if}
