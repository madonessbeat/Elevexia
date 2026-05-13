<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import { ChevronLeft, Sparkles, Download, RefreshCw, Loader } from 'lucide-svelte';
	import FlagBadge from '$lib/components/FlagBadge.svelte';
	import { studentsStore, FLAG_KEYS } from '$lib/stores/students';
	import type { FlagSet } from '$lib/types';

	$: studentId = $page.params.studentId;
	$: topic = $page.url.searchParams.get('topic') ?? '';
	$: student = $studentsStore.students.find((s) => s.id === studentId);
	$: activeFlags = student?.flags
		? (FLAG_KEYS.filter((k) => student!.flags![k].value) as (keyof FlagSet)[])
		: ([] as (keyof FlagSet)[]);

	type Status = 'idle' | 'loading' | 'done' | 'error';
	let status: Status = 'idle';
	let pdfUrl: string | null = null;
	let errorMsg = '';

	// ---- Toast ----
	let toast: string | null = null;
	let toastTimer: ReturnType<typeof setTimeout> | null = null;

	function showToast(msg: string) {
		if (toastTimer) clearTimeout(toastTimer);
		toast = msg;
		toastTimer = setTimeout(() => (toast = null), 3500);
	}

	async function generate() {
		if (!student || !topic) return;

		// Revoke previous blob URL
		if (pdfUrl) {
			URL.revokeObjectURL(pdfUrl);
			pdfUrl = null;
		}

		status = 'loading';
		errorMsg = '';

		try {
			const res = await fetch('/api/generate-material', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					topic,
					activeFlags,
					student
				})
			});

			if (!res.ok) {
				const msg = await res.text().catch(() => 'Unknown error');
				throw new Error(msg || `HTTP ${res.status}`);
			}

			const blob = await res.blob();
			pdfUrl = URL.createObjectURL(blob);
			status = 'done';
		} catch (e) {
			errorMsg = e instanceof Error ? e.message : 'Generation failed';
			status = 'error';
			showToast(`Generation failed: ${errorMsg}`);
		}
	}

	function handleDownload() {
		if (!pdfUrl || !student) return;
		const a = document.createElement('a');
		a.href = pdfUrl;
		a.download = `worksheet-${student.firstName.toLowerCase()}-${topic.replace(/\s+/g, '-')}.pdf`;
		a.click();
	}

	onMount(() => {
		generate();
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

		<!-- Header row -->
		<div class="mb-6 flex items-start justify-between gap-4">
			<div>
				<h1 class="font-display text-2xl font-bold text-foreground">Adapted Worksheet</h1>
				<p class="mt-1 text-sm text-muted-foreground">
					For {student.firstName}
					{student.lastInitial}. · Maths ·
					<span class="font-medium text-foreground">{topic}</span>
				</p>
			</div>
			<div class="flex shrink-0 items-center gap-2">
				<div class="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5">
					<Sparkles class="h-3.5 w-3.5 text-accent-foreground" />
					<span class="text-xs font-medium text-accent-foreground">AI generation</span>
				</div>
			</div>
		</div>

		<!-- Two-column layout -->
		<div class="grid flex-1 grid-cols-5 gap-6 min-h-0">
			<!-- PDF viewer (left 60%) -->
			<div class="col-span-3 flex flex-col">
				{#if status === 'loading'}
					<div class="flex flex-1 items-center justify-center rounded-[--radius] border border-border bg-secondary/40">
						<div class="flex flex-col items-center gap-3 text-center">
							<Loader class="h-8 w-8 animate-spin text-primary" />
							<p class="text-sm font-medium text-foreground">Generating worksheet…</p>
							<p class="text-xs text-muted-foreground">This usually takes 10–20 seconds</p>
						</div>
					</div>
				{:else if status === 'error'}
					<div class="flex flex-1 items-center justify-center rounded-[--radius] border border-destructive/30 bg-destructive/5">
						<div class="flex flex-col items-center gap-3 text-center px-8">
							<p class="text-sm font-medium text-destructive">Generation failed</p>
							<p class="text-xs text-muted-foreground">{errorMsg}</p>
							<button
								type="button"
								on:click={generate}
								class="mt-1 inline-flex items-center gap-1.5 rounded-[--radius] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
							>
								<RefreshCw class="h-3.5 w-3.5" />
								Try again
							</button>
						</div>
					</div>
				{:else if status === 'done' && pdfUrl}
					<iframe
						src={pdfUrl}
						title="Generated worksheet"
						class="flex-1 rounded-[--radius] border border-border bg-white shadow-sm"
						style="min-height: 600px"
					/>
				{:else}
					<div class="flex flex-1 items-center justify-center rounded-[--radius] border border-dashed border-border bg-secondary/30">
						<p class="text-sm text-muted-foreground">Worksheet will appear here</p>
					</div>
				{/if}
			</div>

			<!-- Sidebar (right 40%) -->
			<div class="col-span-2 space-y-4">
				<!-- Action buttons -->
				<div class="space-y-2">
					<button
						type="button"
						disabled={status !== 'done'}
						on:click={handleDownload}
						class="inline-flex w-full items-center justify-center gap-2 rounded-[--radius] bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
					>
						<Download class="h-4 w-4" />
						Download PDF
					</button>
					<button
						type="button"
						disabled={status === 'loading'}
						on:click={generate}
						class="inline-flex w-full items-center justify-center gap-2 rounded-[--radius] border border-border bg-secondary px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-40"
					>
						<RefreshCw class="h-4 w-4 {status === 'loading' ? 'animate-spin' : ''}" />
						{status === 'loading' ? 'Generating…' : 'Regenerate'}
					</button>
				</div>

				<!-- Student info -->
				<div class="rounded-[--radius] border border-border bg-card p-4 space-y-2">
					<p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Student</p>
					<div class="flex items-center gap-3">
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
							{student.firstName[0]}{student.lastInitial}
						</div>
						<div>
							<p class="text-sm font-medium text-foreground">{student.firstName} {student.lastInitial}.</p>
							<p class="text-xs text-muted-foreground">Year {student.yearGroup}</p>
						</div>
					</div>
				</div>

				<!-- Active adaptations -->
				{#if activeFlags.length > 0}
					<div class="rounded-[--radius] border border-border bg-card p-4 space-y-3">
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
						<p class="text-xs text-muted-foreground">No active adaptations — standard Year 5 level.</p>
					</div>
				{/if}

				<!-- Generation info -->
				{#if status === 'done'}
					<p class="text-xs text-muted-foreground">
						Worksheet generated with Claude · Adapted to {student.firstName}'s learning profile
					</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- Toast -->
	{#if toast}
		<div
			transition:fly={{ y: 16, duration: 150 }}
			class="fixed bottom-6 right-6 z-50 rounded-[--radius] bg-foreground px-4 py-3 text-sm font-medium text-background shadow-lg"
		>
			{toast}
		</div>
	{/if}
{/if}
