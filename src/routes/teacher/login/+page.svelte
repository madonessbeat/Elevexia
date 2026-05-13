<script lang="ts">
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let loading = false;

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		// Demo: any credentials accepted
		goto('/teacher');
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-background px-4">
	<div class="w-full max-w-sm space-y-8">
		<div class="text-center">
			<p class="font-display text-2xl font-bold text-primary">Elevexia</p>
			<p class="mt-1 text-sm text-muted-foreground">Sign in to your teacher account</p>
		</div>

		<form on:submit={handleSubmit} class="space-y-4">
			<div class="space-y-1.5">
				<label for="email" class="text-sm font-medium text-foreground">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="you@school.edu"
					autocomplete="email"
					class="w-full rounded-[--radius] border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
				/>
			</div>

			<div class="space-y-1.5">
				<label for="password" class="text-sm font-medium text-foreground">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					placeholder="••••••••"
					autocomplete="current-password"
					class="w-full rounded-[--radius] border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-[--radius] bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60"
			>
				{loading ? 'Signing in…' : 'Sign in'}
			</button>
		</form>

		<p class="text-center text-xs text-muted-foreground">
			Demo mode — any credentials are accepted.
		</p>
	</div>
</div>
