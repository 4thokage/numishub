<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import StatCard from '$lib/components/cards/StatCard.svelte';
	import ChartCard from '$lib/components/cards/ChartCard.svelte';
	import HistoryChart from '$lib/components/charts/HistoryChart.svelte';
	import AIInsightCard from '$lib/components/cards/AIInsightCard.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { formatCurrency } from '$lib/utils/format';
	import { assetClassMeta } from '$lib/utils/meta';

	let { data }: { data: PageData } = $props();

	const h = $derived(data.holding);
</script>

<svelte:head>
	<title>NumisHub · {h ? h.symbol : 'Ativo'}</title>
</svelte:head>

{#if !h}
	<div class="flex flex-col items-center justify-center py-24 text-center">
		<Icon name="search" size={28} class="text-surface-400-600" />
		<p class="mt-3 text-surface-400-600">Ativo não encontrado.</p>
		<a href="/investments" class="mt-4 text-sm font-medium text-brand-300 hover:underline"
			>Voltar a Investimentos</a
		>
	</div>
{:else}
	<button
		type="button"
		onclick={() => goto('/investments')}
		class="mb-4 inline-flex items-center gap-1.5 text-sm text-surface-400-600 transition-fast hover:text-surface-950-50"
	>
		<Icon name="chevron-left" size={16} /> Investimentos
	</button>

	<div class="space-y-6">
		<div class="panel p-6">
			<div class="flex flex-wrap items-center justify-between gap-4">
				<div class="flex items-center gap-4">
					<div
						class="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/12 text-brand-300"
					>
						<Icon name={assetClassMeta[h.assetClass].icon} size={26} />
					</div>
					<div>
						<h1 class="text-2xl font-semibold tracking-tight">{h.symbol}</h1>
						<p class="text-sm text-surface-400-600">{h.name}</p>
					</div>
				</div>
				<div class="text-right">
					<p class="text-3xl font-semibold text-surface-950-50">
						{formatCurrency(h.currentPrice, h.currency)}
					</p>
					<p class="text-sm {h.dayChangePct >= 0 ? 'text-gain-400' : 'text-loss-400'}">
						{h.dayChangePct >= 0 ? '+' : '−'}{Math.abs(h.dayChangePct).toLocaleString('pt-PT', {
							maximumFractionDigits: 1
						})}% hoje
					</p>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
			<StatCard
				label="Valor investido"
				value={h.quantity * h.currentPrice}
				icon="wallet"
				accent="brand"
			/>
			<StatCard
				label="Quantidade"
				value={h.quantity}
				format="number"
				icon="coins"
				accent="surface"
			/>
			<StatCard label="Custo médio" value={h.avgCost} icon="tag" accent="surface" trendPct={0} />
			<StatCard
				label="Ganho"
				value={h.quantity * h.currentPrice - h.quantity * h.avgCost}
				icon="trending-up"
				accent="gain"
				trendPct={((h.currentPrice - h.avgCost) / h.avgCost) * 100}
			/>
		</div>

		<div class="grid gap-6 lg:grid-cols-3">
			<div class="lg:col-span-2">
				<ChartCard title="Histórico de preço" subtitle="Últimos 30 dias">
					<HistoryChart points={h.history} />
				</ChartCard>
			</div>
			<div class="lg:col-span-1">
				<AIInsightCard
					title={data.insight.title}
					body={data.insight.body}
					tone={data.insight.tone}
					icon={data.insight.icon}
				/>
			</div>
		</div>
	</div>
{/if}
