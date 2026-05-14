<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
	<p class="font-display text-4xl font-bold text-primary">{$page.status}</p>
	<p class="text-lg font-medium text-foreground">{$page.error?.message ?? 'Something went wrong'}</p>
	<a href="/teacher/login" class="mt-2 text-sm text-primary underline underline-offset-2">
		Back to sign in
	</a>
</div>
