<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex min-h-screen flex-col items-center justify-center text-center">
	<p class="font-display font-semibold text-destructive">{$page.status}: {$page.error?.message}</p>
	<a href="/teacher/login" class="mt-3 text-sm text-primary underline underline-offset-4">Try again</a>
</div>
