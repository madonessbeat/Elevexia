<script lang="ts">
	import { Settings } from 'lucide-svelte';
</script>

<div class="p-8">
	<h1 class="font-display text-2xl font-bold text-foreground">Settings</h1>
	<p class="mt-0.5 text-sm text-muted-foreground">Account and application preferences</p>

	<div class="mt-10 flex flex-col items-center justify-center rounded-[--radius] border border-dashed border-border bg-secondary/30 py-20 text-center">
		<Settings class="mb-4 h-10 w-10 text-muted-foreground/40" />
		<p class="font-display text-base font-semibold text-muted-foreground">Coming soon</p>
		<p class="mt-1 text-sm text-muted-foreground">
			Class configuration, integrations, and account settings will appear here.
		</p>
	</div>
</div>
