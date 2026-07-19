<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import PercentageChip from '../ui/PercentageChip.svelte';
	import { formatCurrency } from '$lib/utils/format';
	import { categoryMeta } from '$lib/utils/meta';
	import { toneSoftBg, toneText, type Tone } from '$lib/utils/tokens';
	import type { HoldingRowUi } from '$lib/types/ui';

	interface Props {
		holding: HoldingRowUi;
		onclick?: () => void;
	}

	let { holding, onclick }: Props = $props();

	const meta = $derived(
		categoryMeta[holding.assetClass as keyof typeof categoryMeta] ?? {
			label: holding.assetClass,
			icon: 'line-chart',
			colorToken: holding.colorToken
		}
	);
	const tone = $derived(holding.colorToken as Tone);
</script>

<button
	type="button"
	{onclick}
	class="flex w-full items-center gap-4 panel p-4 text-left transition-smooth hover:shadow-[var(--shadow-lift)]"
>
	<div
		class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl {toneSoftBg(
			tone
		)} {toneText(tone)}"
	>
		<Icon name={meta.icon} size={20} />
	</div>
	<div class="min-w-0 flex-1">
		<div class="flex items-center gap-2">
			<h3 class="font-semibold text-surface-950-50">{holding.symbol}</h3>
			<span
				class="rounded-full bg-surface-400-600/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-surface-400-600 uppercase"
				>{meta.label}</span
			>
		</div>
		<p class="truncate text-xs text-surface-400-600">{holding.name}</p>
	</div>
	<div class="flex flex-col items-end gap-1">
		<span class="font-semibold text-surface-950-50"
			>{formatCurrency(holding.value, holding.currency)}</span
		>
		<div class="flex items-center gap-2">
			<PercentageChip pct={holding.gainPct} />
			<span class="text-xs {holding.dayChangePct >= 0 ? toneText('gain') : toneText('loss')}"
				>{holding.dayChangePct >= 0 ? '+' : '−'}{Math.abs(holding.dayChangePct).toLocaleString(
					'pt-PT',
					{ maximumFractionDigits: 1 }
				)}%</span
			>
		</div>
	</div>
</button>
