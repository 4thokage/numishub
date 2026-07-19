<script lang="ts">
	import type { PageData } from './$types';
	import { getTransactions } from '$lib/api';
	import type { Transaction, TransactionCategory } from '$lib/types/domain';
	import { untrack } from 'svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import Chip from '$lib/components/ui/Chip.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import LoadingSkeleton from '$lib/components/ui/LoadingSkeleton.svelte';
	import TransactionRow from '$lib/components/cards/TransactionRow.svelte';
	import SpendingChart from '$lib/components/charts/SpendingChart.svelte';
	import ChartCard from '$lib/components/cards/ChartCard.svelte';
	import { categoryMeta } from '$lib/utils/meta';
	import { toTransactionRowUi } from '$lib/types/mappers';
	import TransactionDrawer from '$lib/features/transactions/components/TransactionDrawer.svelte';

	let { data }: { data: PageData } = $props();

	const filterCats: (TransactionCategory | 'all')[] = [
		'all',
		'salary',
		'investment',
		'groceries',
		'food',
		'transport',
		'shopping',
		'utilities',
		'housing',
		'health',
		'travel'
	];

	let search = $state('');
	let category = $state<TransactionCategory | 'all'>('all');
	let type = $state<'income' | 'expense' | 'all'>('all');

	let items = $state<Transaction[]>([]);
	let total = $state(0);
	let page = $state(1);
	let hasMore = $state(false);
	let loading = $state(false);
	let initialized = $state(false);

	untrack(() => {
		items = data.txns.items;
		total = data.txns.total;
		hasMore = data.txns.hasMore;
	});

	let selected = $state<Transaction | null>(null);

	const filters = (p: number) => ({ page: p, pageSize: 20, search, category, type });

	async function reload() {
		loading = true;
		const res = await getTransactions(filters(1));
		items = res.items;
		total = res.total;
		page = 1;
		hasMore = res.hasMore;
		loading = false;
	}

	async function loadMore() {
		if (loading || !hasMore) return;
		loading = true;
		const res = await getTransactions(filters(page + 1));
		items = [...items, ...res.items];
		page += 1;
		hasMore = res.hasMore;
		loading = false;
	}

	// Refetch when filters change (skip the initial run that already has SSR data).
	$effect(() => {
		void [search, category, type];
		if (!initialized) {
			initialized = true;
			return;
		}
		reload();
	});

	let sentinel = $state<HTMLDivElement>();
	$effect(() => {
		if (!sentinel) return;
		const io = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) loadMore();
			},
			{ rootMargin: '200px' }
		);
		io.observe(sentinel);
		return () => io.disconnect();
	});
</script>

<svelte:head>
	<title>NumisHub · Movimentos</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-semibold tracking-tight">Movimentos</h1>
		<p class="mt-1 text-sm text-surface-400-600">Todas as entradas e saídas da tua conta</p>
	</div>

	<ChartCard title="Gastos por categoria" subtitle="Últimos 6 meses">
		<SpendingChart months={data.spending} />
	</ChartCard>

	<div class="space-y-4 panel p-5">
		<SearchBar bind:value={search} />

		<div class="flex flex-wrap items-center gap-2">
			{#each filterCats as cat (cat)}
				<Chip
					tone={cat === 'all' ? 'brand' : (categoryMeta[cat].colorToken as never)}
					selected={category === cat}
					onclick={() => (category = cat)}
				>
					{cat === 'all' ? 'Todos' : categoryMeta[cat].label}
				</Chip>
			{/each}
			<div class="ml-auto flex rounded-xl bg-surface-400-600/10 p-1">
				{#each ['all', 'income', 'expense'] as t (t)}
					<button
						type="button"
						onclick={() => (type = t as typeof type)}
						class="rounded-lg px-3 py-1.5 text-xs font-medium transition-fast {type === t
							? 'bg-surface-100-900 text-surface-950-50 shadow-sm'
							: 'text-surface-400-600 hover:text-surface-950-50'}"
					>
						{t === 'all' ? 'Tudo' : t === 'income' ? 'Entradas' : 'Saídas'}
					</button>
				{/each}
			</div>
		</div>

		<div class="flex items-center justify-between text-sm text-surface-400-600">
			<span>{total} resultados</span>
		</div>

		{#if loading && items.length === 0}
			<div class="space-y-2">
				{#each Array(8) as _, i (i)}
					<LoadingSkeleton variant="row" />
				{/each}
			</div>
		{:else if items.length === 0}
			<EmptyState
				icon="search"
				title="Sem movimentos"
				description="Não encontramos movimentos para este filtro."
			/>
		{:else}
			<div class="divide-y divide-surface-300-700/20">
				{#each items as txn (txn.id)}
					<TransactionRow txn={toTransactionRowUi(txn)} onclick={() => (selected = txn)} />
				{/each}
			</div>
			{#if hasMore}
				<div bind:this={sentinel} class="flex justify-center py-4">
					{#if loading}
						<LoadingSkeleton variant="row" class="w-full" />
					{:else}
						<button
							type="button"
							onclick={loadMore}
							class="text-sm font-medium text-brand-300 hover:underline">Carregar mais</button
						>
					{/if}
				</div>
			{/if}
		{/if}
	</div>
</div>

<TransactionDrawer transaction={selected} onclose={() => (selected = null)} />
