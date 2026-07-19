<script lang="ts">
	import Icon from './Icon.svelte';
	import { toneFromChange, toneText } from '$lib/utils/tokens';

	interface Props {
		pct: number;
		positiveIsGood?: boolean;
		class?: string;
	}

	let { pct, positiveIsGood = true, class: klass = '' }: Props = $props();

	const tone = $derived(toneFromChange(pct, positiveIsGood));
	const arrow = $derived(pct > 0 ? 'arrow-up' : pct < 0 ? 'arrow-down' : 'arrow-right');
	const sign = $derived(pct > 0 ? '+' : pct < 0 ? '−' : '');
</script>

<span class="inline-flex items-center gap-1 text-sm font-semibold {toneText(tone)} {klass}">
	{#if pct !== 0}
		<Icon name={arrow} size={14} strokeWidth={2.5} />
	{/if}{sign}{Math.abs(pct).toLocaleString('pt-PT', { maximumFractionDigits: 1 })}%
</span>
