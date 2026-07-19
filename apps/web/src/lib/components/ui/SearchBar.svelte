<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		value?: string;
		placeholder?: string;
	}

	let { value = $bindable(''), placeholder = 'Pesquisar…' }: Props = $props();
</script>

<div class="relative">
	<Icon
		name="search"
		size={18}
		class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-surface-400-600"
	/>
	<input
		bind:value
		type="search"
		{placeholder}
		aria-label="Pesquisar"
		class="w-full rounded-xl border border-surface-300-700/40 bg-surface-100-900 py-2.5 pr-3 pl-10 text-sm text-surface-950-50 transition-fast outline-none placeholder:text-surface-400-600 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
	/>
</div>
