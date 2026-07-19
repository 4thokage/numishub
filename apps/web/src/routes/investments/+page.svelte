<script lang="ts">
	import type { PageData } from './$types';
	import StatCard from '$lib/components/cards/StatCard.svelte';
	import ChartCard from '$lib/components/cards/ChartCard.svelte';
	import AIInsightCard from '$lib/components/cards/AIInsightCard.svelte';
	import InvestmentCard from '$lib/components/cards/InvestmentCard.svelte';
	import PerformanceChart from '$lib/components/charts/PerformanceChart.svelte';
	import AllocationChart from '$lib/components/charts/AllocationChart.svelte';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import { toAllocationSliceUi, toHoldingRowUi } from '$lib/types/mappers';
	import { formatCurrency } from '$lib/utils/format';
	import { toneDot, type Tone } from '$lib/utils/tokens';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	const d = $derived(data.portfolio);
	const rows = $derived(data.holdings.map(toHoldingRowUi));

	const allocationTotal = $derived(d.allocation.reduce((s, a) => s + a.value, 0));
	const allocationUi = $derived(d.allocation.map((a) => toAllocationSliceUi(a, allocationTotal)));

	const sorted = $derived([...rows].sort((a, b) => b.gainPct - a.gainPct));
	const topGainers = $derived(sorted.slice(0, 3));
	const topLosers = $derived([...rows].sort((a, b) => a.gainPct - b.gainPct).slice(0, 3));
</script>

<svelte:head>
	<title>NumisHub · Investimentos</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-semibold tracking-tight">Investimentos</h1>
		<p class="mt-1 text-sm text-surface-400-600">O teu portfólio e evolução</p>
	</div>

	<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
		<StatCard
			label="Valor total"
			value={d.totalValue}
			icon="wallet"
			accent="brand"
			trendPct={d.totalGainPct}
		/>
		<StatCard label="Custo base" value={d.totalCost} icon="coins" accent="surface" trendPct={0} />
		<StatCard
			label="Ganho total"
			value={d.totalGain}
			icon="trending-up"
			accent="gain"
			trendPct={d.totalGainPct}
		/>
		<StatCard
			label="Variação hoje"
			value={d.dayChange}
			icon="activity"
			accent={d.dayChange >= 0 ? 'gain' : 'loss'}
			trendPct={d.dayChangePct}
		/>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<div class="lg:col-span-2">
			<ChartCard title="Evolução do portfólio" subtitle="Valor total ao longo do tempo">
				<PerformanceChart points={d.history} />
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

	<div class="grid gap-6 lg:grid-cols-3">
		<div class="panel p-5 lg:col-span-1">
			<SectionHeader title="Alocação" subtitle="Por classe" />
			<div class="mt-2 h-48">
				<AllocationChart slices={allocationUi} />
			</div>
			<div class="mt-4 space-y-2">
				{#each allocationUi as slice (slice.label)}
					<div class="flex items-center justify-between text-sm">
						<div class="flex items-center gap-2">
							<span class="h-2.5 w-2.5 rounded-full {toneDot(slice.colorToken as Tone)}"></span>
							<span class="text-surface-400-600">{slice.label}</span>
						</div>
						<span class="font-medium text-surface-950-50"
							>{Math.round(slice.pct)}% · {formatCurrency(slice.value, 'EUR')}</span
						>
					</div>
				{/each}
			</div>
		</div>

		<div class="space-y-6 lg:col-span-2">
			<div class="panel p-5">
				<SectionHeader title="Maiores ganhos" />
				<div class="mt-3 space-y-2">
					{#each topGainers as h (h.id)}
						<InvestmentCard holding={h} onclick={() => goto(`/investments/${h.id}`)} />
					{/each}
				</div>
			</div>
			<div class="panel p-5">
				<SectionHeader title="Maiores perdas" />
				<div class="mt-3 space-y-2">
					{#each topLosers as h (h.id)}
						<InvestmentCard holding={h} onclick={() => goto(`/investments/${h.id}`)} />
					{/each}
				</div>
			</div>
		</div>
	</div>

	<div class="panel p-5">
		<SectionHeader title="Todos os ativos" subtitle="{rows.length} posições">
			{#snippet action()}
				<a href="/investments" class="text-sm font-medium text-brand-300 hover:underline"
					>Ver detalhe</a
				>
			{/snippet}
		</SectionHeader>
		<div class="mt-3 grid gap-3 sm:grid-cols-2">
			{#each rows as h (h.id)}
				<InvestmentCard holding={h} onclick={() => goto(`/investments/${h.id}`)} />
			{/each}
		</div>
	</div>
</div>
