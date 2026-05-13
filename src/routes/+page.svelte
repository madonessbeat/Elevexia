<script lang="ts">
	import { fly } from 'svelte/transition';
	import { ArrowRight } from 'lucide-svelte';
	import FlagBadge from '$lib/components/FlagBadge.svelte';
	import type { FlagSet } from '$lib/types';

	// ── Demo card loop ────────────────────────────────────────────
	let cycleKey = $state(0);

	const demoFlags: Array<{ flag: keyof FlagSet }> = [
		{ flag: 'reading_accessibility' },
		{ flag: 'attention_chunking' },
		{ flag: 'language_scaffolding' },
		{ flag: 'hands_on_learning' },
		{ flag: 'extended_challenge' }
	];

	$effect(() => {
		const id = setInterval(() => cycleKey++, 10000);
		return () => clearInterval(id);
	});

	// ── Scroll reveal ─────────────────────────────────────────────
	function revealOnEnter(node: Element, onEnter: () => void) {
		const io = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) {
					onEnter();
					io.disconnect();
				}
			},
			{ threshold: 0.15 }
		);
		io.observe(node);
		return {
			destroy() {
				io.disconnect();
			}
		};
	}

	let v1 = $state(false);
	let v2 = $state(false);
	let v3 = $state(false);

	// ── Static data ───────────────────────────────────────────────
	const dokLevels = [
		{ label: 'DOK 1 — Recall', pct: 92 },
		{ label: 'DOK 2 — Skill', pct: 74 },
		{ label: 'DOK 3 — Strategy', pct: 48 },
		{ label: 'DOK 4 — Extended', pct: 21 }
	];

	const suggestedFlags: Array<{ flag: keyof FlagSet; reason: string }> = [
		{ flag: 'reading_accessibility', reason: 'Quiz: phonics patterns missed' },
		{ flag: 'attention_chunking', reason: 'Survey: prefers short sections' }
	];

	const pdfCards = [
		{
			initials: 'SM',
			name: 'Sara M.',
			flags: 'Reading · Language · Chunking',
			offsetClass: 'translate-x-4 translate-y-4 z-[1]'
		},
		{
			initials: 'TK',
			name: 'Tom K.',
			flags: 'Chunking · Challenge',
			offsetClass: 'translate-x-2 translate-y-2 z-[2]'
		},
		{
			initials: 'PS',
			name: 'Priya S.',
			flags: 'Language · Hands-on',
			offsetClass: 'z-[3]'
		}
	];
</script>

<svelte:head>
	<title>Elevexia — Every student gets the lesson they need</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-background text-foreground">

	<!-- ── Nav ──────────────────────────────────────────────────── -->
	<header class="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-sm">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
			<span class="font-display text-base font-semibold tracking-tight text-foreground">Elevexia</span>
			<div class="flex items-center gap-3">
				<a
					href="/student"
					class="text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					Student view
				</a>
				<a
					href="/teacher/login"
					class="inline-flex items-center gap-1.5 rounded-[--radius] bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
				>
					Sign in <ArrowRight class="h-3.5 w-3.5" />
				</a>
			</div>
		</div>
	</header>

	<!-- ── Hero ─────────────────────────────────────────────────── -->
	<section
		class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-5 lg:items-center lg:gap-16 lg:py-32"
	>
		<!-- Left 3/5 -->
		<div class="lg:col-span-3">
			<span class="mb-5 inline-block text-xs font-semibold uppercase tracking-widest text-primary">
				For Year 4–6 teachers
			</span>
			<h1
				class="text-balance font-display text-5xl font-bold leading-[1.05] text-foreground lg:text-7xl"
				style="letter-spacing: -0.02em"
			>
				Every student gets<br class="hidden lg:block" /> the lesson they need.<br
					class="hidden lg:block"
				/>
				<span class="text-primary">In one click.</span>
			</h1>
			<p class="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
				Elevexia turns quiz evidence into AI-adapted worksheets — validated by you, personalised for
				each child.
			</p>
			<div class="mt-10 flex flex-col gap-3 sm:flex-row">
				<a
					href="/teacher/login"
					class="inline-flex items-center justify-center gap-2 rounded-[--radius] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
				>
					Open teacher dashboard
					<ArrowRight class="h-4 w-4" />
				</a>
				<a
					href="/student"
					class="inline-flex items-center justify-center rounded-[--radius] border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
				>
					Student view →
				</a>
			</div>
		</div>

		<!-- Right 2/5 — Live demo card -->
		<div class="lg:col-span-2">
			<div class="rounded-xl border border-border bg-card p-5 shadow-xl ring-1 ring-border/50">
				<!-- Card header -->
				<div class="mb-4 flex items-center gap-3">
					<div
						class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
					>
						SM
					</div>
					<div>
						<p class="text-sm font-semibold text-foreground">Sara M.</p>
						<p class="text-xs text-muted-foreground">Year 5 · Maple Class</p>
					</div>
					<span
						class="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
					>
						Profile complete
					</span>
				</div>

				{#key cycleKey}
					<!-- Flags animate in with stagger -->
					<div class="mb-4 flex flex-wrap gap-2">
						{#each demoFlags as { flag }, i}
							<span in:fly={{ y: 8, duration: 260, delay: i * 220 }}>
								<FlagBadge {flag} state="active" />
							</span>
						{/each}
					</div>

					<!-- Worksheet preview after 1.5 s -->
					{#await new Promise((r) => setTimeout(r, 1500)) then}
						<div
							in:fly={{ y: 10, duration: 350 }}
							class="rounded-lg border border-border bg-secondary/50 p-3"
						>
							<div class="mb-2.5 flex items-center justify-between">
								<p class="text-xs font-semibold text-foreground">Adapted Worksheet · Fractions</p>
								<span class="text-[10px] text-muted-foreground">AI generated</span>
							</div>
							<div class="space-y-1.5">
								<div class="h-1.5 w-full rounded-full bg-muted"></div>
								<div class="h-1.5 w-5/6 rounded-full bg-muted"></div>
								<div class="h-1.5 w-full rounded-full bg-muted"></div>
								<div class="h-1.5 w-4/5 rounded-full bg-muted"></div>
								<div class="h-1.5 w-3/5 rounded-full bg-muted"></div>
							</div>
							<div class="mt-3 flex gap-2">
								<div
									class="flex h-7 flex-1 items-center justify-center rounded-md bg-primary"
								>
									<span class="text-[10px] font-semibold text-primary-foreground">Download PDF</span>
								</div>
								<div class="flex h-7 flex-1 items-center justify-center rounded-md bg-muted">
									<span class="text-[10px] font-medium text-muted-foreground">Regenerate</span>
								</div>
							</div>
						</div>
					{/await}
				{/key}
			</div>
		</div>
	</section>

	<!-- ── Value section 1: Quiz insights ────────────────────────── -->
	<section
		class="border-t border-border"
		use:revealOnEnter={() => (v1 = true)}
	>
		<div
			class="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 py-20 lg:grid-cols-2 lg:items-center"
		>
			<div
				class="transition-all duration-700 {v1
					? 'translate-y-0 opacity-100'
					: 'translate-y-8 opacity-0'}"
			>
				<span class="text-xs font-semibold uppercase tracking-widest text-primary">
					Student-generated insights
				</span>
				<h2
					class="mt-3 font-display text-3xl font-bold tracking-tight text-foreground lg:text-4xl"
				>
					Know your whole class in 5 minutes
				</h2>
				<p class="mt-4 text-base leading-relaxed text-muted-foreground">
					A lightweight quiz surfaces each student's depth of knowledge across four levels — no admin
					burden, no separate assessment tools.
				</p>
			</div>
			<div
				class="transition-all delay-150 duration-700 {v1
					? 'translate-y-0 opacity-100'
					: 'translate-y-8 opacity-0'}"
			>
				<div class="rounded-xl border border-border bg-card p-5 shadow-sm">
					<p class="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
						Class overview · Fractions
					</p>
					{#each dokLevels as { label, pct }}
						<div class="mb-3 last:mb-0">
							<div class="mb-1.5 flex items-center justify-between text-xs">
								<span class="text-foreground">{label}</span>
								<span class="font-medium text-muted-foreground">{pct}%</span>
							</div>
							<div class="h-2 w-full overflow-hidden rounded-full bg-muted">
								<div
									class="h-2 rounded-full bg-primary transition-all duration-1000"
									style="width: {v1 ? pct : 0}%"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- ── Value section 2: Validate / Override ──────────────────── -->
	<section
		class="border-t border-border bg-secondary/30"
		use:revealOnEnter={() => (v2 = true)}
	>
		<div
			class="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 py-20 lg:grid-cols-2 lg:items-center"
		>
			<div
				class="transition-all duration-700 lg:order-2 {v2
					? 'translate-y-0 opacity-100'
					: 'translate-y-8 opacity-0'}"
			>
				<span class="text-xs font-semibold uppercase tracking-widest text-primary">
					You remain in charge
				</span>
				<h2
					class="mt-3 font-display text-3xl font-bold tracking-tight text-foreground lg:text-4xl"
				>
					Validate or override. Always.
				</h2>
				<p class="mt-4 text-base leading-relaxed text-muted-foreground">
					Every AI-suggested adaptation lands in your review queue. One click to approve; a text
					field to correct it. Nothing reaches a student without your sign-off.
				</p>
			</div>
			<div
				class="transition-all delay-150 duration-700 lg:order-1 {v2
					? 'translate-y-0 opacity-100'
					: 'translate-y-8 opacity-0'}"
			>
				<div class="rounded-xl border border-border bg-card p-5 shadow-sm">
					<p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
						Suggested adaptations · Tom K.
					</p>
					<div class="space-y-3">
						{#each suggestedFlags as item}
							<div class="space-y-2.5 rounded-lg border border-border bg-background p-3">
								<div class="flex flex-wrap items-center gap-2">
									<FlagBadge flag={item.flag} state="active" />
									<span class="text-xs text-muted-foreground">{item.reason}</span>
								</div>
								<div class="flex gap-2">
									<button
										type="button"
										class="flex-1 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
									>
										✓ Validate
									</button>
									<button
										type="button"
										class="flex-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
									>
										Override
									</button>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ── Value section 3: Stacked PDFs ─────────────────────────── -->
	<section
		class="border-t border-border"
		use:revealOnEnter={() => (v3 = true)}
	>
		<div
			class="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 py-20 lg:grid-cols-2 lg:items-center"
		>
			<div
				class="transition-all duration-700 {v3
					? 'translate-y-0 opacity-100'
					: 'translate-y-8 opacity-0'}"
			>
				<span class="text-xs font-semibold uppercase tracking-widest text-primary">
					Adapted content, instantly
				</span>
				<h2
					class="mt-3 font-display text-3xl font-bold tracking-tight text-foreground lg:text-4xl"
				>
					One click. A worksheet built for them.
				</h2>
				<p class="mt-4 text-base leading-relaxed text-muted-foreground">
					Enter a topic and generate a full PDF in under 20 seconds — adapted to each student's
					active flags. Download or regenerate instantly.
				</p>
			</div>
			<div
				class="transition-all delay-150 duration-700 {v3
					? 'translate-y-0 opacity-100'
					: 'translate-y-8 opacity-0'}"
			>
				<!-- Stacked card visual -->
				<div class="relative h-52">
					{#each pdfCards as card}
						<div
							class="absolute inset-0 rounded-xl border border-border bg-card p-4 shadow-sm {card.offsetClass}"
						>
							<div class="mb-2 flex items-center justify-between">
								<div class="flex items-center gap-2">
									<div
										class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary"
									>
										{card.initials}
									</div>
									<span class="text-xs font-semibold text-foreground">{card.name}</span>
								</div>
								<span
									class="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary"
								>
									PDF ready
								</span>
							</div>
							<p class="mb-2 text-[10px] text-muted-foreground">{card.flags}</p>
							<div class="space-y-1">
								<div class="h-1.5 w-full rounded-full bg-muted"></div>
								<div class="h-1.5 w-5/6 rounded-full bg-muted"></div>
								<div class="h-1.5 w-3/4 rounded-full bg-muted"></div>
								<div class="h-1.5 w-full rounded-full bg-muted"></div>
								<div class="h-1.5 w-4/5 rounded-full bg-muted"></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- ── Closing CTA strip ─────────────────────────────────────── -->
	<section class="border-t border-border px-6 py-24 text-center">
		<div class="mx-auto max-w-2xl">
			<h2
				class="font-display text-3xl font-bold tracking-tight text-foreground lg:text-5xl"
				style="letter-spacing: -0.02em"
			>
				Ready to see it in action?
			</h2>
			<p class="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
				Explore the full demo — from student quiz to adapted PDF — in under 5 minutes.
			</p>
			<a
				href="/teacher/login"
				class="mt-10 inline-flex items-center gap-2 rounded-[--radius] bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
			>
				Open teacher dashboard
				<ArrowRight class="h-4 w-4" />
			</a>
		</div>
	</section>

	<!-- ── Footer ────────────────────────────────────────────────── -->
	<footer class="border-t border-border px-8 py-6 text-center text-xs text-muted-foreground">
		Elevexia prototype · Built for demonstration purposes
	</footer>
</div>
