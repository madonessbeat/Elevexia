<script lang="ts">
	export let question: {
		id: string;
		text: string;
		options: { value: string; label: string }[];
	};
	export let value: string | null;
	export let onChange: (v: string) => void;
</script>

<fieldset class="space-y-3">
	<legend class="font-display text-lg font-medium text-foreground">{question.text}</legend>
	<div class="space-y-2">
		{#each question.options as option}
			<label
				class="flex min-h-16 cursor-pointer items-center gap-3 rounded-[--radius] border px-4 py-3 transition-colors {value ===
				option.value
					? 'border-primary bg-accent text-accent-foreground'
					: 'border-border bg-card hover:bg-secondary'}"
			>
				<input
					type="radio"
					name={question.id}
					value={option.value}
					checked={value === option.value}
					on:change={() => onChange(option.value)}
					class="sr-only"
				/>
				<span
					class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 {value ===
					option.value
						? 'border-primary'
						: 'border-input'}"
				>
					{#if value === option.value}
						<span class="h-2 w-2 rounded-full bg-primary"></span>
					{/if}
				</span>
				<span class="text-sm">{option.label}</span>
			</label>
		{/each}
	</div>
</fieldset>
