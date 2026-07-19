<script lang="ts">
	import type { PageData } from './$types';
	import GoalCard from '$lib/components/cards/GoalCard.svelte';
	import AIInsightCard from '$lib/components/cards/AIInsightCard.svelte';
	import CreateGoalModal from '$lib/features/goals/components/CreateGoalModal.svelte';
	import { toGoalProgressUi } from '$lib/types/mappers';
	import { formatCurrency } from '$lib/utils/format';
	import Icon from '$lib/components/ui/Icon.svelte';

	let { data }: { data: PageData } = $props();

	const cards = $derived(data.goals.map(toGoalProgressUi));
	const totalTarget = $derived(data.goals.reduce((s, g) => s + g.targetAmount, 0));
	const totalSaved = $derived(data.goals.reduce((s, g) => s + g.currentAmount, 0));
	const overallPct = $derived(totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0);

	let modalOpen = $state(false);
</script>

<svelte:head>
	<title>NumisHub · Objetivos</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Objetivos</h1>
			<p class="mt-1 text-sm text-surface-400-600">Acompanha e atinge as tuas metas financeiras</p>
		</div>
		<button
			type="button"
			onclick={() => (modalOpen = true)}
			class="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-fast hover:brightness-110"
		>
			<Icon name="plus" size={16} /> Novo objetivo
		</button>
	</div>

	<div class="panel p-5">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm text-surface-400-600">Progresso global</p>
				<p class="mt-1 text-2xl font-semibold text-surface-950-50">
					{formatCurrency(totalSaved, 'EUR')}
					<span class="text-base font-normal text-surface-400-600"
						>/ {formatCurrency(totalTarget, 'EUR')}</span
					>
				</p>
			</div>
			<p class="text-lg font-semibold text-brand-300">{Math.round(overallPct)}%</p>
		</div>
		<div class="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-surface-400-600/15">
			<div
				class="h-full rounded-full bg-brand-500"
				style="width:{Math.min(overallPct, 100)}%"
			></div>
		</div>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<div class="space-y-4 lg:col-span-2">
			{#each cards as card (card.id)}
				<GoalCard goal={card} />
			{/each}
			{#if cards.length === 0}
				<p class="panel p-8 text-center text-surface-400-600">
					Ainda não tens objetivos. Cria o teu primeiro!
				</p>
			{/if}
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

<CreateGoalModal open={modalOpen} onclose={() => (modalOpen = false)} />
