<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { openMobileNav } from '$lib/stores/ui';

	interface Props {
		title?: string;
	}

	let { title = 'NumisHub' }: Props = $props();
</script>

<header
	class="sticky top-0 z-20 flex items-center justify-between border-b border-surface-300-700/30 bg-surface-50-950/85 px-4 py-3 backdrop-blur lg:hidden"
>
	<button
		type="button"
		onclick={openMobileNav}
		aria-label="Abrir menu"
		class="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-400-600/10 text-surface-950-50"
	>
		<Icon name="menu" size={20} />
	</button>
	<span class="font-semibold tracking-tight">{title}</span>
	<ThemeToggle />
</header>
