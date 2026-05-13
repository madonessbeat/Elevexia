<script lang="ts">
	import { onNavigate, afterNavigate } from '$app/navigation';

	let { children } = $props();

	const studentRoutes = ['/student', '/student/survey', '/student/quiz', '/student/done'];

	onNavigate((nav) => {
		const fromIdx = studentRoutes.indexOf(nav.from?.url.pathname ?? '');
		const toIdx = studentRoutes.indexOf(nav.to?.url.pathname ?? '');
		const html = document.documentElement;
		html.classList.remove('student-nav-forward', 'student-nav-backward');
		if (fromIdx !== -1 && toIdx !== -1) {
			html.classList.add(toIdx > fromIdx ? 'student-nav-forward' : 'student-nav-backward');
		}
	});

	afterNavigate(() => {
		document.documentElement.classList.remove('student-nav-forward', 'student-nav-backward');
	});
</script>

<div class="min-h-screen bg-background font-reading">
	<main class="mx-auto max-w-3xl px-4 py-8">
		{@render children()}
	</main>
</div>
