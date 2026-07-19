<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import AccountCard from '$lib/components/cards/AccountCard.svelte';
	import { formatCurrency } from '$lib/utils/format';

	let { data }: { data: PageData } = $props();

	const total = $derived(data.accounts.reduce((s, a) => s + a.balance, 0));
</script>

<svelte:head>
	<title>NumisHub · Contas</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Contas</h1>
			<p class="mt-1 text-sm text-surface-400-600">Os teus bancos e carteiras ligados</p>
		</div>
		<div class="text-right">
			<p class="text-sm text-surface-400-600">Saldo total</p>
			<p class="text-2xl font-semibold text-surface-950-50">{formatCurrency(total, 'EUR')}</p>
		</div>
	</div>

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.accounts as account (account.id)}
			<AccountCard {account} onclick={() => goto(`/accounts/${account.id}`)} />
		{/each}
	</div>
</div>
