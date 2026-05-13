<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { Command } from 'cmdk-sv';
	import { goto } from '$app/navigation';
	import { toggleMode } from 'mode-watcher';
	import { toast } from 'svelte-sonner';
	import { Search, ArrowRight, RotateCcw, Moon, User } from 'lucide-svelte';
	import { studentsStore } from '$lib/stores/students';

	let { open = $bindable(false) }: { open: boolean } = $props();

	const students = $derived($studentsStore.students);

	function run(fn: () => void) {
		open = false;
		setTimeout(fn, 60);
	}
</script>

<Dialog.Root {open} onOpenChange={(v) => (open = v)}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
		<Dialog.Content
			class="fixed left-1/2 top-[28%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
		>
			<Command.Root>
				<!-- Search input row -->
				<div class="flex items-center gap-3 border-b border-border px-4">
					<Search class="h-4 w-4 shrink-0 text-muted-foreground" />
					<Command.Input
						autofocus={true}
						class="h-12 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
						placeholder="Search students or actions…"
					/>
					<kbd
						class="hidden rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:block"
					>
						esc
					</kbd>
				</div>

				<Command.List class="max-h-80 overflow-y-auto p-1.5">
					<Command.Empty class="py-8 text-center text-sm text-muted-foreground">
						No results found.
					</Command.Empty>

					<!-- Jump to student -->
					<Command.Group heading="Jump to student">
						{#each students as student}
							<Command.Item
								value="jump {student.firstName} {student.lastInitial}"
								onSelect={() =>
									run(() => goto(`/teacher/student/${student.id}`))}
							>
								<User class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
								{student.firstName}
								{student.lastInitial}.
								{#if student.flags !== null && !student.validatedByTeacher}
									<span
										class="ml-auto rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
									>
										Review
									</span>
								{/if}
							</Command.Item>
						{/each}
					</Command.Group>

					<Command.Separator />

					<!-- Generate worksheet -->
					<Command.Group heading="Generate worksheet for">
						{#each students as student}
							<Command.Item
								value="worksheet {student.firstName} {student.lastInitial} fractions"
								onSelect={() =>
									run(() =>
										goto(`/teacher/material/${student.id}?topic=Fractions`))}
							>
								<ArrowRight class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
								{student.firstName}
								{student.lastInitial}. → Fractions
							</Command.Item>
						{/each}
					</Command.Group>

					<Command.Separator />

					<!-- Actions -->
					<Command.Group heading="Actions">
						<Command.Item
							value="reset demo data"
							onSelect={() =>
								run(() => {
									studentsStore.reset();
									toast.success('Demo data reset.');
								})}
						>
							<RotateCcw class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
							Reset demo data
						</Command.Item>
						<Command.Item
							value="open student view"
							onSelect={() => run(() => goto('/student'))}
						>
							<ArrowRight class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
							Open student view
						</Command.Item>
						<Command.Item
							value="toggle dark mode light"
							onSelect={() => run(() => toggleMode())}
						>
							<Moon class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
							Toggle dark mode
						</Command.Item>
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

