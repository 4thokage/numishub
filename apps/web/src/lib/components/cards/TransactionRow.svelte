<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import { formatCurrency, formatRelative } from '$lib/utils/format';
	import { categoryMeta } from '$lib/utils/meta';
	import { toneSoftBg, toneText, type Tone } from '$lib/utils/tokens';
	import type { TransactionRowUi } from '$lib/types/ui';

	interface Props {
		txn: TransactionRowUi;
		onclick?: () => void;
	}

	let { txn, onclick }: Props = $props();

	const meta = $derived(categoryMeta[txn.category]);
	const tone = $derived(meta.colorToken as Tone);
	const isIncome = $derived(txn.amount > 0);
</script>

<button
	type="button"
	{onclick}
	class="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-fast hover:bg-surface-400-600/10"
>
	<div
		class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl {toneSoftBg(
			tone
		)} {toneText(tone)}"
	>
		<Icon name={meta.icon} size={18} />
	</div>
	<div class="min-w-0 flex-1">
		<div class="flex items-center gap-2">
			<p class="truncate text-sm font-medium text-surface-950-50">{txn.merchant}</p>
			{#if txn.isRecurring}
				<Icon name="repeat" size={12} class="shrink-0 text-surface-400-600" />
			{/if}
		</div>
		<p class="truncate text-xs text-surface-400-600">
			{meta.label} · {formatRelative(txn.date)}
		</p>
	</div>
	<span
		class="shrink-0 text-sm font-semibold {isIncome ? toneText('gain') : 'text-surface-950-50'}"
	>
		{isIncome ? '+' : '−'}{formatCurrency(Math.abs(txn.amount), txn.currency).replace('−', '')}
	</span>
</button>
