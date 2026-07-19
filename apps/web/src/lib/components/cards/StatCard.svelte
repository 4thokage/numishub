<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import PercentageChip from '../ui/PercentageChip.svelte';
	import { formatCurrency, formatNumber } from '$lib/utils/format';
	import { toneSoftBg, toneText, type Tone } from '$lib/utils/tokens';
	import type { CurrencyCode } from '$lib/types/domain';

	interface Props {
		label: string;
		value: number;
		format?: 'currency' | 'number';
		currency?: CurrencyCode;
		trendPct?: number;
		positiveIsGood?: boolean;
		icon: string;
		accent?: Tone;
		footnote?: string;
	}

	let {
		label,
		value,
		format = 'currency',
		currency = 'EUR',
		trendPct = 0,
		positiveIsGood = true,
		icon,
		accent = 'brand',
		footnote
	}: Props = $props();

	const display = $derived(
		format === 'currency' ? formatCurrency(value, currency) : formatNumber(value)
	);
</script>

<div class="panel p-5 transition-smooth hover:shadow-[var(--shadow-lift)]">
	<div class="flex items-center justify-between">
		<span class="text-sm text-surface-400-600">{label}</span>
		<div
			class="flex h-9 w-9 items-center justify-center rounded-xl {toneSoftBg(accent)} {toneText(
				accent
			)}"
		>
			<Icon name={icon} size={18} />
		</div>
	</div>
	<div class="mt-3 flex items-end justify-between gap-2">
		<span class="text-2xl font-semibold tracking-tight text-surface-950-50">{display}</span>
		{#if trendPct !== 0}
			<PercentageChip pct={trendPct} {positiveIsGood} />
		{/if}
	</div>
	{#if footnote}
		<p class="mt-1 text-xs text-surface-400-600">{footnote}</p>
	{/if}
</div>
