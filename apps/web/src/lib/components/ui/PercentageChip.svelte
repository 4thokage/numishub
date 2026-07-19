<script lang="ts">
	import Icon from './Icon.svelte';
	import { toneFromChange, toneSoftBg, toneText } from '$lib/utils/tokens';

	interface Props {
		pct: number;
		positiveIsGood?: boolean;
		size?: 'sm' | 'md';
	}

	let { pct, positiveIsGood = true, size = 'sm' }: Props = $props();

	const tone = $derived(toneFromChange(pct, positiveIsGood));
	const arrow = $derived(pct > 0 ? 'arrow-up-right' : pct < 0 ? 'arrow-down-right' : 'arrow-right');
	const sign = $derived(pct > 0 ? '+' : pct < 0 ? '−' : '');
</script>

<span
	class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold {toneSoftBg(
		tone
	)} {toneText(tone)}"
>
	{#if pct !== 0}
		<Icon name={arrow} size={size === 'sm' ? 12 : 14} strokeWidth={2.5} />
	{/if}{sign}{Math.abs(pct).toLocaleString('pt-PT', { maximumFractionDigits: 1 })}%
</span>
