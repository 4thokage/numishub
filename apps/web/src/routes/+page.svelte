<script lang="ts">
	import type { PageData } from './$types';
	import NetWorthChart from '$lib/components/charts/NetWorthChart.svelte';
	import AllocationChart from '$lib/components/charts/AllocationChart.svelte';
	import StatCard from '$lib/components/cards/StatCard.svelte';
	import AIInsightCard from '$lib/components/cards/AIInsightCard.svelte';
	import GoalCard from '$lib/components/cards/GoalCard.svelte';
	import TransactionRow from '$lib/components/cards/TransactionRow.svelte';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import PercentageChip from '$lib/components/ui/PercentageChip.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { toAllocationSliceUi, toGoalProgressUi, toTransactionRowUi } from '$lib/types/mappers';
	import { formatCurrency, formatSignedCurrency } from '$lib/utils/format';
	import { toneDot, type Tone } from '$lib/utils/tokens';

	let { data }: { data: PageData } = $props();

	const d = $derived(data.dashboard);

	const recentRows = $derived(d.recentTransactions.map(toTransactionRowUi));
	const goalCards = $derived(d.topGoals.map(toGoalProgressUi));

	const allocationTotal = $derived(d.allocation.reduce((s, a) => s + a.value, 0));
	const allocationUi = $derived(d.allocation.map((a) => toAllocationSliceUi(a, allocationTotal)));

	const periods = ['3M', '6M', '1A', 'Máx'] as const;
	let period = $state<(typeof periods)[number]>('1A');
	const periodLen = (p: (typeof periods)[number]): number =>
		({ '3M': 3, '6M': 6, '1A': 12, Máx: d.netWorthHistory.length })[p];
	const chartPoints = $derived(d.netWorthHistory.slice(-periodLen(period)));
</script>

<svelte:head>
	<title>NumisHub · Início</title>
</svelte:head>

<div class="space-y-6">
	<!-- Hero: net worth + portfolio chart -->
	<section class="panel p-6 transition-smooth sm:p-8">
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<p class="text-sm text-surface-400-600">Património líquido</p>
				<div class="mt-1 flex items-end gap-3">
					<h1 class="text-4xl font-semibold tracking-tight text-surface-950-50 sm:text-5xl">
						{formatCurrency(d.netWorth, 'EUR')}
					</h1>
				</div>
				<div class="mt-2 flex items-center gap-2">
					<PercentageChip pct={d.monthlyChangePct} />
					<span class="text-sm text-surface-400-600">
						{formatSignedCurrency(d.monthlyChange)} este mês
					</span>
				</div>
			</div>
			<div class="flex rounded-xl bg-surface-400-600/10 p-1">
				{#each periods as p (p)}
					<button
						type="button"
						onclick={() => (period = p)}
						class="rounded-lg px-3 py-1.5 text-xs font-medium transition-fast {period === p
							? 'bg-surface-100-900 text-surface-950-50 shadow-sm'
							: 'text-surface-400-600 hover:text-surface-950-50'}"
					>
						{p}
					</button>
				{/each}
			</div>
		</div>
		<div class="mt-6 h-60 w-full sm:h-72">
			<NetWorthChart points={chartPoints} />
		</div>
	</section>

	<!-- Stat cards -->
	<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
		<StatCard label="Dinheiro" value={d.cash} icon="wallet" accent="brand" trendPct={2.4} />
		<StatCard
			label="Investimentos"
			value={d.investments}
			icon="trending-up"
			accent="gain"
			trendPct={4.2}
		/>
		<StatCard
			label="Dívida"
			value={d.debt}
			icon="credit-card"
			accent="loss"
			trendPct={-3.1}
			positiveIsGood={false}
		/>
		<StatCard
			label="Gastos do mês"
			value={d.monthlySpending}
			icon="receipt"
			accent="warn"
			trendPct={d.monthlySpendingTrendPct}
			positiveIsGood={false}
		/>
	</div>

	<!-- Recent transactions + AI insight -->
	<div class="grid gap-6 lg:grid-cols-3">
		<div class="panel p-5 lg:col-span-2">
			<SectionHeader title="Movimentos recentes">
				{#snippet action()}
					<a href="/transactions" class="text-sm font-medium text-brand-300 hover:underline"
						>Ver todos</a
					>
				{/snippet}
			</SectionHeader>
			<div class="mt-3 divide-y divide-surface-300-700/20">
				{#each recentRows as row (row.id)}
					<TransactionRow txn={row} />
				{/each}
			</div>
		</div>

		<div class="lg:col-span-1">
			<AIInsightCard
				title={d.insight.title}
				body={d.insight.body}
				tone={d.insight.tone}
				icon={d.insight.icon}
			/>
		</div>
	</div>

	<!-- Allocation + goals -->
	<div class="grid gap-6 lg:grid-cols-3">
		<div class="panel p-5 lg:col-span-1">
			<SectionHeader title="Alocação" subtitle="Por classe de ativo" />
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

		<div class="panel p-5 lg:col-span-2">
			<SectionHeader title="Os teus objetivos" subtitle="Progresso e projeção">
				{#snippet action()}
					<a href="/goals" class="text-sm font-medium text-brand-300 hover:underline">Ver todos</a>
				{/snippet}
			</SectionHeader>
			<div class="mt-4 grid gap-4 sm:grid-cols-2">
				{#each goalCards as goal (goal.id)}
					<GoalCard {goal} />
				{/each}
			</div>
		</div>
	</div>

	<p class="flex items-center justify-center gap-1.5 pt-2 text-xs text-surface-400-600">
		<Icon name="sparkles" size={13} class="text-brand-400" />
		Dados simulados para demonstração · NumisHub
	</p>
</div>
