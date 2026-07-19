<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		subtitle?: string;
		action?: Snippet;
	}

	let { title, subtitle, action }: Props = $props();
</script>

<div class="flex items-end justify-between gap-4">
	<div class="min-w-0">
		<h2 class="text-lg font-semibold tracking-tight text-surface-950-50">{title}</h2>
		{#if subtitle}
			<p class="mt-0.5 text-sm text-surface-400-600">{subtitle}</p>
		{/if}
	</div>
	{#if action}
		<div class="shrink-0">{@render action()}</div>
	{/if}
</div>
