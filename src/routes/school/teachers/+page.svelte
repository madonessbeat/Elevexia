<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { schoolStore } from '$lib/stores/school';

	$: teachers = $schoolStore.teachers;
	let search = '';
	$: filtered = teachers.filter(
		(t) =>
			t.name.toLowerCase().includes(search.toLowerCase()) ||
			t.subject.toLowerCase().includes(search.toLowerCase())
	);

	function statusColor(daysAgo: number): string {
		if (daysAgo <= 7) return 'bg-emerald-500';
		if (daysAgo <= 30) return 'bg-amber-400';
		return 'bg-muted-foreground/30';
	}
	function statusLabel(daysAgo: number): string {
		if (daysAgo === 0) return 'Today';
		if (daysAgo === 1) return 'Yesterday';
		return `${daysAgo}d ago`;
	}
</script>

<div class="mx-auto max-w-7xl px-6 py-10">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-foreground">Teaching Staff</h1>
			<p class="mt-0.5 text-sm text-muted-foreground">
				{teachers.length} teachers · Administrative view only
			</p>
		</div>
		<input
			type="search"
			bind:value={search}
			placeholder="Search by name or subject…"
			class="w-56 rounded-[--radius] border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
		/>
	</div>

	<div class="rounded-[--radius] border border-border bg-card overflow-hidden">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
					<th class="px-5 py-3 text-left font-semibold">Teacher</th>
					<th class="px-4 py-3 text-left font-semibold">Subject</th>
					<th class="px-4 py-3 text-left font-semibold">Year groups</th>
					<th class="px-4 py-3 text-left font-semibold">Students</th>
					<th class="px-4 py-3 text-left font-semibold">Last active</th>
					<th class="px-4 py-3 text-left font-semibold">Status</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-border">
				{#each filtered as teacher}
					<tr
						class="transition-colors hover:bg-secondary/30 cursor-default"
						on:click={() => toast.info('Administrative view only — no editing available.')}
					>
						<td class="px-5 py-3 font-medium text-foreground">{teacher.name}</td>
						<td class="px-4 py-3 text-muted-foreground">{teacher.subject}</td>
						<td class="px-4 py-3">
							<div class="flex flex-wrap gap-1">
								{#each teacher.yearGroups as yg}
									<span class="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{yg}</span>
								{/each}
							</div>
						</td>
						<td class="px-4 py-3 tabular-nums text-muted-foreground">{teacher.studentCount}</td>
						<td class="px-4 py-3 text-muted-foreground">{statusLabel(teacher.lastActiveDaysAgo)}</td>
						<td class="px-4 py-3">
							<span class="inline-flex items-center gap-1.5">
								<span class="h-2 w-2 rounded-full {statusColor(teacher.lastActiveDaysAgo)}"></span>
								<span class="text-xs text-muted-foreground">
									{teacher.lastActiveDaysAgo <= 7 ? 'Active' : teacher.lastActiveDaysAgo <= 30 ? 'Recent' : 'Inactive'}
								</span>
							</span>
						</td>
					</tr>
				{/each}
				{#if filtered.length === 0}
					<tr>
						<td colspan={6} class="px-5 py-10 text-center text-sm text-muted-foreground">
							No teachers match "{search}"
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>
