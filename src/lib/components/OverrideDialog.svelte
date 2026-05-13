<script lang="ts">
	import { Dialog } from 'bits-ui';
	import type { FlagSet } from '$lib/types';

	export let open: boolean;
	export let flag: keyof FlagSet;
	export let currentValue: boolean;
	export let onConfirm: (reason: string) => void;
	export let onCancel: () => void;

	const flagLabels: Record<keyof FlagSet, string> = {
		reading_accessibility: 'Reading Accessibility',
		attention_chunking: 'Attention Chunking',
		language_scaffolding: 'Language Scaffolding',
		hands_on_learning: 'Hands-on Learning',
		extended_challenge: 'Extended Challenge'
	};

	let reason = '';
	$: reasonValid = reason.trim().length >= 10;

	function handleConfirm() {
		if (!reasonValid) return;
		onConfirm(reason.trim());
		reason = '';
	}

	function handleCancel() {
		reason = '';
		onCancel();
	}
</script>

<Dialog.Root {open} onOpenChange={(v) => { if (!v) handleCancel(); }}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
		<Dialog.Content
			class="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[--radius] border border-border bg-card p-6 shadow-xl"
		>
			<Dialog.Title class="font-display text-lg font-semibold text-foreground">
				Override: {flagLabels[flag]}
			</Dialog.Title>
			<Dialog.Description class="mt-1 text-sm text-muted-foreground">
				Current value: <strong>{currentValue ? 'Active' : 'Inactive'}</strong>. Will be changed to
				<strong>{currentValue ? 'Inactive' : 'Active'}</strong>.
			</Dialog.Description>

			<div class="mt-4 space-y-1.5">
				<label for="override-reason" class="text-sm font-medium text-foreground">
					Reason <span class="font-normal text-muted-foreground">(min 10 characters)</span>
				</label>
				<textarea
					id="override-reason"
					bind:value={reason}
					rows="3"
					placeholder="Describe why you are overriding this flag…"
					class="w-full rounded-[--radius] border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
				></textarea>
				<p class="text-xs text-muted-foreground">
					{reason.trim().length} / 10 minimum characters
				</p>
			</div>

			<div class="mt-5 flex justify-end gap-3">
				<button
					type="button"
					on:click={handleCancel}
					class="rounded-[--radius] border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-muted"
				>
					Cancel
				</button>
				<button
					type="button"
					disabled={!reasonValid}
					on:click={handleConfirm}
					class="rounded-[--radius] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
				>
					Confirm override
				</button>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
