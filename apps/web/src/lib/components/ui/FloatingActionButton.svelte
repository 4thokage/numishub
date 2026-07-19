<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		onclick?: () => void;
		icon?: string;
		label?: string;
	}

	let { onclick, icon = 'plus', label = 'Adicionar' }: Props = $props();
</script>

<button
	type="button"
	{onclick}
	aria-label={label}
	class="fixed right-5 bottom-24 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-[var(--shadow-lift)] transition-fast hover:scale-105 hover:brightness-110 active:scale-95 lg:bottom-8"
>
	<Icon name={icon} size={24} />
</button>
