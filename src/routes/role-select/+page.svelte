<script lang="ts">
	import { goto } from '$app/navigation';
	import { GraduationCap, Heart, Building2 } from 'lucide-svelte';
	import RoleCard from '$lib/components/RoleCard.svelte';
	import { authStore } from '$lib/stores/auth';
	import type { DashboardRole } from '$lib/types';

	function selectRole(role: DashboardRole, href: string) {
		authStore.setRole(role);
		goto(href);
	}
</script>

<svelte:head>
	<title>Choose your dashboard — Elevexia</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
	<!-- Wordmark -->
	<div class="mb-12 text-center">
		<p class="font-display text-3xl font-bold text-primary tracking-tight">Elevexia</p>
		<p class="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
			Knowledge Empowers
		</p>
	</div>

	<div class="mb-8 text-center">
		<h1 class="font-display text-xl font-semibold text-foreground">Who are you signing in as?</h1>
		<p class="mt-1 text-sm text-muted-foreground">Choose your dashboard to continue.</p>
	</div>

	<!-- Role cards -->
	<div class="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
		<RoleCard
			title="Teacher"
			description="Manage students, generate lesson plans, and create differentiated materials."
			href="/teacher"
			iconBg="bg-indigo-100 dark:bg-indigo-950"
			iconColor="text-indigo-700 dark:text-indigo-300"
			Icon={GraduationCap}
			onclick={() => selectRole('teacher', '/teacher')}
		/>
		<RoleCard
			title="Parent"
			description="View your child's progress, learning profile, and teacher insights."
			href="/parent"
			iconBg="bg-violet-100 dark:bg-violet-950"
			iconColor="text-violet-700 dark:text-violet-300"
			Icon={Heart}
			onclick={() => selectRole('parent', '/parent')}
		/>
		<RoleCard
			title="School Admin"
			description="Monitor all teachers, view school-wide analytics, and track outcomes."
			href="/school"
			iconBg="bg-slate-100 dark:bg-slate-800"
			iconColor="text-slate-700 dark:text-slate-300"
			Icon={Building2}
			onclick={() => selectRole('school', '/school')}
		/>
	</div>

	<!-- Sign out -->
	<p class="mt-10 text-xs text-muted-foreground">
		Signed in as <span class="font-medium text-foreground">demo@elevexia.io</span> ·
		<a
			href="/teacher/login"
			on:click={() => authStore.clearRole()}
			class="hover:text-primary underline underline-offset-2"
		>
			Sign out
		</a>
	</p>
</div>
