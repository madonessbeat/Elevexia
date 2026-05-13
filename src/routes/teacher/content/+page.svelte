<script lang="ts">
	import { BookOpen } from 'lucide-svelte';
</script>

<div class="p-8">
	<h1 class="font-display text-2xl font-bold text-foreground">Content</h1>
	<p class="mt-0.5 text-sm text-muted-foreground">Worksheet library and generated materials</p>

	<div class="mt-10 flex flex-col items-center justify-center rounded-[--radius] border border-dashed border-border bg-secondary/30 py-20 text-center">
		<BookOpen class="mb-4 h-10 w-10 text-muted-foreground/40" />
		<p class="font-display text-base font-semibold text-muted-foreground">Coming soon</p>
		<p class="mt-1 text-sm text-muted-foreground">
			Generated worksheets and saved materials will appear here.
		</p>
	</div>
</div>
