<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
	<div class="space-y-3">
		<p class="font-display text-lg font-semibold text-destructive">
			{$page.status}: Something went wrong
		</p>
		<p class="text-sm text-muted-foreground">{$page.error?.message ?? 'An unexpected error occurred.'}</p>
		<a href="/student" class="text-sm text-primary underline underline-offset-4">Go back to start</a>
	</div>
</div>
