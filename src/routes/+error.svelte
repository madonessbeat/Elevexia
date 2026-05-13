<script lang="ts">
	import { page } from '$app/stores';
</script>

<div style="padding: 2rem; font-family: monospace;">
	<h1 style="color: #dc2626; font-size: 1.25rem; margin-bottom: 0.5rem;">
		{$page.status}: {$page.error?.message ?? 'Unknown error'}
	</h1>
	{#if $page.error?.stack}
		<pre style="font-size: 0.75rem; white-space: pre-wrap; color: #374151;">{$page.error.stack}</pre>
	{/if}
</div>
