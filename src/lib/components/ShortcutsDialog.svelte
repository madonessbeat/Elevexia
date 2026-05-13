<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { X } from 'lucide-svelte';

	let { open = $bindable(false) }: { open: boolean } = $props();

	const sections = [
		{
			title: 'Navigation',
			shortcuts: [
				{ keys: ['⌘', 'K'], description: 'Open command palette' },
				{ keys: ['?'], description: 'Open keyboard shortcuts' },
				{ keys: ['Esc'], description: 'Close dialogs / palette' }
			]
		},
		{
			title: 'Student profile',
			shortcuts: [
				{ keys: ['↵'], description: 'Generate worksheet for topic' }
			]
		},
		{
			title: 'General',
			shortcuts: [
				{ keys: ['⌘', 'D'], description: 'Toggle dark mode (via palette)' }
			]
		}
	];
</script>

<Dialog.Root {open} onOpenChange={(v) => (open = v)}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
		<Dialog.Content
			class="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-[--radius] border border-border bg-card p-6 shadow-xl"
		>
			<div class="mb-4 flex items-center justify-between">
				<Dialog.Title class="font-display text-base font-semibold text-foreground">
					Keyboard shortcuts
				</Dialog.Title>
				<Dialog.Close
					class="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					<X class="h-4 w-4" />
				</Dialog.Close>
			</div>

			<div class="space-y-5">
				{#each sections as section}
					<div>
						<p class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
							{section.title}
						</p>
						<div class="space-y-1.5">
							{#each section.shortcuts as shortcut}
								<div class="flex items-center justify-between gap-4">
									<span class="text-sm text-foreground">{shortcut.description}</span>
									<div class="flex shrink-0 items-center gap-1">
										{#each shortcut.keys as key}
											<kbd
												class="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-muted-foreground"
											>
												{key}
											</kbd>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
