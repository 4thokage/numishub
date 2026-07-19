<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import StatCard from '$lib/components/cards/StatCard.svelte';
	import ChartCard from '$lib/components/cards/ChartCard.svelte';
	import HistoryChart from '$lib/components/charts/HistoryChart.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { formatCurrency } from '$lib/utils/format';
	import { accountTypeMeta } from '$lib/utils/meta';

	let { data }: { data: PageData } = $props();

	const a = $derived(data.account);
	const hist = $derived((a?.history ?? []).map((p) => p.value));
	const first = $derived(hist[0] ?? 0);
	const last = $derived(hist[hist.length - 1] ?? 0);
	const change = $derived(last - first);
	const monthIn = $derived(Math.max(change, 0));
	const monthOut = $derived(Math.max(-change, 0));
</script>

<svelte:head>
	<title>NumisHub · {a ? a.name : 'Conta'}</title>
</svelte:head>

{#if !a}
	<div class="flex flex-col items-center justify-center py-24 text-center">
		<Icon name="search" size={28} class="text-surface-400-600" />
		<p class="mt-3 text-surface-400-600">Conta não encontrada.</p>
		<a href="/accounts" class="mt-4 text-sm font-medium text-brand-300 hover:underline"
			>Voltar a Contas</a
		>
	</div>
{:else}
	<button
		type="button"
		onclick={() => goto('/accounts')}
		class="mb-4 inline-flex items-center gap-1.5 text-sm text-surface-400-600 transition-fast hover:text-surface-950-50"
	>
		<Icon name="chevron-left" size={16} /> Contas
	</button>

	<div class="space-y-6">
		<div class="flex flex-wrap items-center justify-between gap-4 panel p-6">
			<div class="flex items-center gap-4">
				<div
					class="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/12 text-brand-300"
				>
					<Icon name={accountTypeMeta[a.type].icon} size={26} />
				</div>
				<div>
					<h1 class="text-2xl font-semibold tracking-tight">{a.name}</h1>
					<p class="text-sm text-surface-400-600">{a.institution} · {a.mask}</p>
				</div>
			</div>
			<div class="text-right">
				<p class="text-3xl font-semibold text-surface-950-50">
					{formatCurrency(a.balance, a.currency)}
				</p>
				<p class="text-sm text-surface-400-600">{accountTypeMeta[a.type].label}</p>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
			<StatCard label="Disponível" value={a.balance} icon="wallet" accent="brand" />
			<StatCard label="Em espera" value={0} icon="clock" accent="warn" trendPct={0} />
			<StatCard label="Entradas (mês)" value={monthIn} icon="arrow-down-left" accent="gain" />
			<StatCard label="Saídas (mês)" value={monthOut} icon="arrow-up-right" accent="loss" />
		</div>

		<ChartCard title="Evolução do saldo" subtitle="Últimos 30 dias">
			<HistoryChart points={a.history} />
		</ChartCard>
	</div>
{/if}
