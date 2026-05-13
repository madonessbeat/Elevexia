<script lang="ts">
	import { ClipboardList, Brain, Clock } from 'lucide-svelte';
</script>

<div class="flex min-h-[70vh] flex-col items-center justify-center text-center">
	<div class="w-full max-w-sm space-y-8">
		<div class="flex justify-center">
			<div class="rounded-full bg-primary/10 p-6">
				<ClipboardList class="h-12 w-12 text-primary" />
			</div>
		</div>

		<div class="space-y-3">
			<h1 class="font-display text-3xl font-bold text-foreground">Hello there!</h1>
			<p class="text-muted-foreground">
				You're about to answer some questions that help your teacher understand how you learn best.
				There are no wrong answers — just be honest!
			</p>
		</div>

		<ul class="space-y-3 text-left">
			<li class="flex items-center gap-3 rounded-[--radius] bg-secondary px-4 py-3 text-sm">
				<ClipboardList class="h-4 w-4 shrink-0 text-primary" />
				<span>10 quick questions about how you like to learn</span>
			</li>
			<li class="flex items-center gap-3 rounded-[--radius] bg-secondary px-4 py-3 text-sm">
				<Brain class="h-4 w-4 shrink-0 text-primary" />
				<span>10 maths questions at your level</span>
			</li>
			<li class="flex items-center gap-3 rounded-[--radius] bg-secondary px-4 py-3 text-sm">
				<Clock class="h-4 w-4 shrink-0 text-primary" />
				<span>Takes about 10–15 minutes in total</span>
			</li>
		</ul>

		<a
			href="/student/survey"
			class="block w-full rounded-[--radius] bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground"
		>
			Let's start!
		</a>
	</div>
</div>
