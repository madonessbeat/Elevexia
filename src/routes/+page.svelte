<script lang="ts">
	import { BookOpen, ShieldCheck, FileText } from 'lucide-svelte';

	const cards = [
		{
			icon: BookOpen,
			title: '5-minute student profile',
			body: 'A short survey and quiz generate a full adaptive learning profile — no lengthy assessments, no spreadsheets.'
		},
		{
			icon: ShieldCheck,
			title: 'Teacher always in control',
			body: 'Every AI flag can be validated or overridden with a reason. Nothing reaches a student without your sign-off.'
		},
		{
			icon: FileText,
			title: 'Curriculum-aligned adapted PDFs',
			body: 'Worksheets are generated to match Year 4–6 content with built-in adaptations for reading, language, attention, and challenge.'
		}
	];
</script>

<svelte:head>
	<title>Elevexia — Adaptive Learning for Year 4–6</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-background">
	<!-- Nav bar -->
	<header class="border-b border-border px-8 py-4">
		<div class="mx-auto flex max-w-5xl items-center justify-between">
			<span class="font-display text-lg font-semibold text-primary">Elevexia</span>
			<a
				href="/teacher/login"
				class="rounded-[--radius] border border-border bg-secondary px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
			>
				Sign in
			</a>
		</div>
	</header>

	<!-- Hero -->
	<section class="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
		<div class="mx-auto max-w-2xl">
			<span
				class="mb-6 inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground"
			>
				Prototype · Year 4–6 Maths
			</span>

			<h1 class="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
				Differentiation that fits<br />every student
			</h1>

			<p class="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
				AI-assisted adapted materials for Year 4–6 — teacher-validated, never automated.
			</p>

			<div class="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
				<a
					href="/teacher/login"
					class="rounded-[--radius] bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
				>
					Watch the demo →
				</a>
				<a
					href="/student"
					class="rounded-[--radius] border border-border px-8 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted"
				>
					Student view
				</a>
			</div>
		</div>
	</section>

	<!-- Value cards -->
	<section class="border-t border-border bg-secondary/30 px-6 py-16">
		<div class="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
			{#each cards as card}
				<div class="rounded-[--radius] border border-border bg-card p-6">
					<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
						<svelte:component this={card.icon} class="h-5 w-5 text-primary" />
					</div>
					<h2 class="mb-2 font-display text-base font-semibold text-foreground">{card.title}</h2>
					<p class="text-sm leading-relaxed text-muted-foreground">{card.body}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-border px-8 py-6 text-center text-xs text-muted-foreground">
		Elevexia prototype · Built for demonstration purposes
	</footer>
</div>
