<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex h-full flex-1 flex-col items-center justify-center p-8 text-center">
	<p class="font-display text-lg font-semibold text-destructive">
		{$page.status}: Something went wrong
	</p>
	<p class="mt-1 text-sm text-muted-foreground">{$page.error?.message ?? 'An unexpected error occurred.'}</p>
	<a href="/teacher" class="mt-4 text-sm text-primary underline underline-offset-4">Back to dashboard</a>
</div>
