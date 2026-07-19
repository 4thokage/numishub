<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { invalidateAll } from '$app/navigation';
	import { createGoal } from '$lib/api';
	import type { CreateGoalInput } from '$lib/types/dto';
	import { goalCategoryMeta } from '$lib/utils/meta';
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { GoalCategory } from '$lib/types/domain';

	interface Props {
		open: boolean;
		onclose: () => void;
	}

	let { open, onclose }: Props = $props();

	const categories = Object.keys(goalCategoryMeta) as GoalCategory[];

	let name = $state('');
	let category = $state<GoalCategory>('emergency');
	let targetAmount = $state<number | null>(null);
	let monthlyContribution = $state<number | null>(null);
	let targetDate = $state('');
	let submitting = $state(false);
	let error = $state('');

	const selectedMeta = $derived(goalCategoryMeta[category]);

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		if (!name.trim() || !targetAmount || !monthlyContribution || !targetDate) {
			error = 'Preenche os campos obrigatórios.';
			return;
		}
		submitting = true;
		error = '';
		const input: CreateGoalInput = {
			name: name.trim(),
			category,
			target_amount: targetAmount,
			current_amount: 0,
			target_date: new Date(targetDate).toISOString(),
			monthly_contribution: monthlyContribution,
			color_token: selectedMeta.colorToken,
			icon: selectedMeta.icon
		};
		await createGoal(input);
		await invalidateAll();
		submitting = false;
		reset();
		onclose();
	}

	function reset() {
		name = '';
		category = 'emergency';
		targetAmount = null;
		monthlyContribution = null;
		targetDate = '';
		error = '';
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
		role="dialog"
		aria-modal="true"
		aria-label="Criar objetivo"
	>
		<button
			type="button"
			class="absolute inset-0 bg-black/50 backdrop-blur-sm"
			aria-label="Fechar"
			onclick={onclose}
			transition:fade={{ duration: 150 }}
		></button>
		<form
			onsubmit={submit}
			class="relative w-full max-w-md space-y-4 rounded-3xl bg-surface-100-900 p-6 shadow-[var(--shadow-lift)]"
			transition:scale={{ duration: 180, start: 0.96 }}
		>
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold">Novo objetivo</h2>
				<button
					type="button"
					onclick={onclose}
					aria-label="Fechar"
					class="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-400-600/10 text-surface-400-600 transition-fast hover:text-surface-950-50"
				>
					<Icon name="x" size={18} />
				</button>
			</div>

			<div>
				<label for="goal-name" class="mb-1 block text-sm font-medium text-surface-400-600"
					>Nome</label
				>
				<input
					id="goal-name"
					bind:value={name}
					type="text"
					placeholder="Ex.: Fundo de emergência"
					class="w-full rounded-xl border border-surface-300-700/40 bg-surface-50-950 px-3 py-2.5 text-sm text-surface-950-50 transition-fast outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
				/>
			</div>

			<div>
				<p class="mb-1 block text-sm font-medium text-surface-400-600">Categoria</p>
				<div class="flex flex-wrap gap-2">
					{#each categories as cat (cat)}
						{@const meta = goalCategoryMeta[cat]}
						<button
							type="button"
							onclick={() => (category = cat)}
							class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-fast {category ===
							cat
								? `${'bg-' + meta.colorToken + '-500'} text-white`
								: 'bg-surface-400-600/10 text-surface-400-600'}"
						>
							<Icon name={meta.icon} size={13} />
							{meta.label}
						</button>
					{/each}
				</div>
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div>
					<label for="goal-target" class="mb-1 block text-sm font-medium text-surface-400-600"
						>Montante alvo (€)</label
					>
					<input
						id="goal-target"
						bind:value={targetAmount}
						type="number"
						min="0"
						step="50"
						class="w-full rounded-xl border border-surface-300-700/40 bg-surface-50-950 px-3 py-2.5 text-sm text-surface-950-50 transition-fast outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
					/>
				</div>
				<div>
					<label for="goal-monthly" class="mb-1 block text-sm font-medium text-surface-400-600"
						>Poupança mensal (€)</label
					>
					<input
						id="goal-monthly"
						bind:value={monthlyContribution}
						type="number"
						min="0"
						step="10"
						class="w-full rounded-xl border border-surface-300-700/40 bg-surface-50-950 px-3 py-2.5 text-sm text-surface-950-50 transition-fast outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
					/>
				</div>
			</div>

			<div>
				<label for="goal-date" class="mb-1 block text-sm font-medium text-surface-400-600"
					>Data prevista</label
				>
				<input
					id="goal-date"
					bind:value={targetDate}
					type="date"
					class="w-full rounded-xl border border-surface-300-700/40 bg-surface-50-950 px-3 py-2.5 text-sm text-surface-950-50 transition-fast outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
				/>
			</div>

			{#if error}
				<p class="text-sm text-loss-400">{error}</p>
			{/if}

			<div class="flex justify-end gap-2 pt-2">
				<button
					type="button"
					onclick={onclose}
					class="rounded-xl px-4 py-2.5 text-sm font-medium text-surface-400-600 transition-fast hover:text-surface-950-50"
					>Cancelar</button
				>
				<button
					type="submit"
					disabled={submitting}
					class="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-fast hover:brightness-110 disabled:opacity-60"
					>Criar objetivo</button
				>
			</div>
		</form>
	</div>
{/if}
