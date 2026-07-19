<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import { categoryMeta } from '$lib/utils/meta';
	import { toneSoftBg, toneText, type Tone } from '$lib/utils/tokens';
	import type { Transaction } from '$lib/types/domain';

	interface Props {
		transaction: Transaction | null;
		onclose: () => void;
	}

	let { transaction, onclose }: Props = $props();

	const meta = $derived(transaction ? categoryMeta[transaction.category] : null);
	const tone = $derived((meta?.colorToken ?? 'surface') as Tone);
	const isIncome = $derived(transaction ? transaction.amount > 0 : false);
</script>

{#if transaction}
	<div class="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Detalhe do movimento">
		<button
			type="button"
			class="absolute inset-0 bg-black/50 backdrop-blur-sm"
			aria-label="Fechar"
			onclick={onclose}
			transition:fade={{ duration: 150 }}
		></button>
		<div
			class="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface-100-900 shadow-[var(--shadow-lift)]"
			transition:fly={{ x: 320, duration: 220 }}
		>
			<div class="flex items-center justify-between border-b border-surface-300-700/30 p-4">
				<h2 class="font-semibold">Detalhe do movimento</h2>
				<button
					type="button"
					onclick={onclose}
					aria-label="Fechar"
					class="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-400-600/10 text-surface-400-600 transition-fast hover:text-surface-950-50"
				>
					<Icon name="x" size={18} />
				</button>
			</div>

			<div class="flex-1 overflow-y-auto p-5">
				<div
					class="flex h-14 w-14 items-center justify-center rounded-2xl {toneSoftBg(
						tone
					)} {toneText(tone)}"
				>
					<Icon name={meta?.icon ?? 'tag'} size={24} />
				</div>
				<h3 class="mt-4 text-xl font-semibold text-surface-950-50">{transaction.merchant}</h3>
				<p class="text-sm text-surface-400-600">{transaction.description}</p>
				<p
					class="mt-3 text-3xl font-semibold {isIncome ? toneText('gain') : 'text-surface-950-50'}"
				>
					{isIncome ? '+' : '−'}{formatCurrency(Math.abs(transaction.amount), transaction.currency)}
				</p>

				<div class="mt-6 space-y-3 rounded-2xl bg-surface-400-600/8 p-4 text-sm">
					<div class="flex justify-between">
						<span class="text-surface-400-600">Categoria</span>
						<span class="font-medium text-surface-950-50">{meta?.label}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-surface-400-600">Data</span>
						<span class="font-medium text-surface-950-50"
							>{formatDate(transaction.date, 'long')}</span
						>
					</div>
					<div class="flex justify-between">
						<span class="text-surface-400-600">Conta</span>
						<span class="font-medium text-surface-950-50">{transaction.accountName}</span>
					</div>
					{#if transaction.isRecurring}
						<div class="flex justify-between">
							<span class="text-surface-400-600">Recorrente</span>
							<span class="inline-flex items-center gap-1 font-medium {toneText('brand')}"
								><Icon name="repeat" size={13} /> Sim</span
							>
						</div>
					{/if}
					{#if transaction.pending}
						<div class="flex justify-between">
							<span class="text-surface-400-600">Estado</span>
							<span class="font-medium text-warn-400">Pendente</span>
						</div>
					{/if}
				</div>

				{#if transaction.notes}
					<div class="mt-4">
						<p class="mb-1 text-xs font-medium tracking-wide text-surface-400-600 uppercase">
							Notas
						</p>
						<p class="text-sm text-surface-950-50">{transaction.notes}</p>
					</div>
				{/if}

				<div class="mt-4">
					<p class="mb-1 text-xs font-medium tracking-wide text-surface-400-600 uppercase">
						Recibo
					</p>
					{#if transaction.hasReceipt}
						<div
							class="flex items-center justify-center rounded-2xl border border-dashed border-surface-300-700/50 bg-surface-400-600/5 py-10 text-sm text-surface-400-600"
						>
							<Icon name="receipt" size={20} class="mr-2" /> Recibo em anexo
						</div>
					{:else}
						<div
							class="flex items-center justify-center rounded-2xl border border-dashed border-surface-300-700/50 py-10 text-sm text-surface-400-600"
						>
							Sem recibo associado
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
