<script lang="ts">
	import Icon from './Icon.svelte';
	import { fly } from 'svelte/transition';
	import type { Tone } from '$lib/utils/tokens';
	import { toneText } from '$lib/utils/tokens';

	export interface QuickAction {
		label: string;
		icon: string;
		href?: string;
		tone?: Tone;
		onclick?: () => void;
	}

	interface Props {
		actions: QuickAction[];
	}

	let { actions }: Props = $props();

	let open = $state(false);

	function choose(a: QuickAction) {
		open = false;
		a.onclick?.();
	}
</script>

<div class="fixed right-5 bottom-24 z-30 flex flex-col items-end gap-3 lg:bottom-8">
	{#if open}
		<div class="flex flex-col items-end gap-2" transition:fly={{ y: 10, duration: 180 }}>
			{#each actions as a (a.label)}
				{#if a.href}
					<a
						href={a.href}
						onclick={() => choose(a)}
						class="flex items-center gap-2 rounded-full bg-surface-100-900 px-4 py-2.5 text-sm font-medium text-surface-950-50 shadow-[var(--shadow-soft)] transition-fast hover:brightness-110"
					>
						<span>{a.label}</span>
						<Icon name={a.icon} size={16} class={a.tone ? toneText(a.tone) : ''} />
					</a>
				{:else}
					<button
						type="button"
						onclick={() => choose(a)}
						class="flex items-center gap-2 rounded-full bg-surface-100-900 px-4 py-2.5 text-sm font-medium text-surface-950-50 shadow-[var(--shadow-soft)] transition-fast hover:brightness-110"
					>
						<span>{a.label}</span>
						<Icon name={a.icon} size={16} class={a.tone ? toneText(a.tone) : ''} />
					</button>
				{/if}
			{/each}
		</div>
	{/if}

	<button
		type="button"
		onclick={() => (open = !open)}
		aria-label="Ações rápidas"
		aria-expanded={open}
		class="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-[var(--shadow-lift)] transition-fast hover:scale-105 hover:brightness-110 active:scale-95"
	>
		<Icon name={open ? 'x' : 'plus'} size={24} />
	</button>
</div>
