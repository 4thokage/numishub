<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';

	interface Props {
		icon?: string;
		title: string;
		description?: string;
		action?: Snippet;
	}

	let { icon = 'search', title, description, action }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center px-6 py-14 text-center">
	<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-400-600/10">
		<Icon name={icon} size={26} class="text-surface-400-600" />
	</div>
	<h3 class="text-base font-semibold text-surface-950-50">{title}</h3>
	{#if description}
		<p class="mt-1 max-w-xs text-sm text-surface-400-600">{description}</p>
	{/if}
	{#if action}
		<div class="mt-5">{@render action()}</div>
	{/if}
</div>
