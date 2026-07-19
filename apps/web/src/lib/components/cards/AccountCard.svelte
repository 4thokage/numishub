<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import { formatCurrency } from '$lib/utils/format';
	import { accountTypeMeta } from '$lib/utils/meta';
	import StatusBadge from '../ui/StatusBadge.svelte';
	import { toneSoftBg, toneText, type Tone } from '$lib/utils/tokens';
	import type { Account } from '$lib/types/domain';

	interface Props {
		account: Account;
		onclick?: () => void;
	}

	let { account, onclick }: Props = $props();

	const meta = $derived(accountTypeMeta[account.type]);
	const tone = $derived(account.colorToken as Tone);
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
			<h3 class="truncate font-semibold text-surface-950-50">{account.name}</h3>
		</div>
		<p class="truncate text-xs text-surface-400-600">{account.institution} · {account.mask}</p>
	</div>
	<div class="flex flex-col items-end gap-1">
		<span class="font-semibold text-surface-950-50"
			>{formatCurrency(account.balance, account.currency)}</span
		>
		<StatusBadge status={account.status} />
	</div>
</button>
