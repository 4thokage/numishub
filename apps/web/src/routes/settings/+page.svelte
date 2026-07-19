<script lang="ts">
	import type { PageData } from './$types';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { themeMode, setTheme } from '$lib/stores/theme';
	import type { ThemeMode } from '$lib/stores/theme';

	let { data }: { data: PageData } = $props();

	const s = $derived(data.settings);

	const themes: { id: ThemeMode; label: string; icon: string }[] = [
		{ id: 'dark', label: 'Escuro', icon: 'moon' },
		{ id: 'light', label: 'Claro', icon: 'sun' }
	];
</script>

<svelte:head>
	<title>NumisHub · Definições</title>
</svelte:head>

<div class="mx-auto max-w-2xl space-y-6">
	<h1 class="text-2xl font-semibold tracking-tight">Definições</h1>

	<section class="panel p-5">
		<h2 class="text-sm font-semibold text-surface-400-600">Perfil</h2>
		<div class="mt-4 flex items-center gap-4">
			<div
				class="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/12 text-xl font-semibold text-brand-300"
			>
				{s.profile.name
					.split(' ')
					.map((p) => p[0])
					.slice(0, 2)
					.join('')}
			</div>
			<div>
				<p class="font-semibold text-surface-950-50">{s.profile.name}</p>
				<p class="text-sm text-surface-400-600">{s.profile.email}</p>
			</div>
		</div>
	</section>

	<section class="panel p-5">
		<h2 class="text-sm font-semibold text-surface-400-600">Aparência</h2>
		<div class="mt-4 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<Icon name="palette" size={18} class="text-surface-400-600" />
				<span class="text-surface-950-50">Tema</span>
			</div>
			<div class="flex gap-1 rounded-xl bg-surface-400-600/10 p-1">
				{#each themes as t (t.id)}
					<button
						type="button"
						onclick={() => setTheme(t.id)}
						class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-fast {$themeMode ===
						t.id
							? 'bg-surface-50-950 text-surface-950-50 shadow-sm'
							: 'text-surface-400-600'}"
					>
						<Icon name={t.icon} size={14} />
						{t.label}
					</button>
				{/each}
			</div>
		</div>
	</section>

	<section class="panel p-5">
		<h2 class="text-sm font-semibold text-surface-400-600">Preferências</h2>
		<div class="mt-4 space-y-3">
			<div class="flex items-center justify-between">
				<span class="text-surface-950-50">Moeda base</span>
				<span class="rounded-lg bg-surface-400-600/10 px-3 py-1.5 text-sm text-surface-400-600"
					>{s.currency}</span
				>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-surface-950-50">Idioma</span>
				<span class="rounded-lg bg-surface-400-600/10 px-3 py-1.5 text-sm text-surface-400-600"
					>pt-PT</span
				>
			</div>
		</div>
	</section>

	<section class="panel p-5">
		<h2 class="text-sm font-semibold text-surface-400-600">Notificações</h2>
		<div class="mt-4 space-y-1">
			<div class="flex items-center justify-between py-2">
				<span class="text-surface-950-50">Insights da IA</span>
				<span
					class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium {s
						.notifications.insights
						? 'bg-gain-500/12 text-gain-400'
						: 'bg-surface-400-600/10 text-surface-400-600'}"
					>{s.notifications.insights ? 'Ativo' : 'Inativo'}</span
				>
			</div>
			<div class="flex items-center justify-between py-2">
				<span class="text-surface-950-50">Transações grandes</span>
				<span
					class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium {s
						.notifications.largeTransactions
						? 'bg-gain-500/12 text-gain-400'
						: 'bg-surface-400-600/10 text-surface-400-600'}"
					>{s.notifications.largeTransactions ? 'Ativo' : 'Inativo'}</span
				>
			</div>
			<div class="flex items-center justify-between py-2">
				<span class="text-surface-950-50">Marcos de objetivos</span>
				<span
					class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium {s
						.notifications.goalMilestones
						? 'bg-gain-500/12 text-gain-400'
						: 'bg-surface-400-600/10 text-surface-400-600'}"
					>{s.notifications.goalMilestones ? 'Ativo' : 'Inativo'}</span
				>
			</div>
			<div class="flex items-center justify-between py-2">
				<span class="text-surface-950-50">Resumo semanal</span>
				<span
					class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium {s
						.notifications.weekly
						? 'bg-gain-500/12 text-gain-400'
						: 'bg-surface-400-600/10 text-surface-400-600'}"
					>{s.notifications.weekly ? 'Ativo' : 'Inativo'}</span
				>
			</div>
		</div>
	</section>

	<section class="panel p-5">
		<h2 class="text-sm font-semibold text-surface-400-600">Segurança</h2>
		<div class="mt-4 space-y-1">
			<div class="flex items-center justify-between py-2">
				<span class="text-surface-950-50">Autenticação de dois fatores</span>
				<span
					class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium {s
						.security.twoFactor
						? 'bg-gain-500/12 text-gain-400'
						: 'bg-surface-400-600/10 text-surface-400-600'}"
					>{s.security.twoFactor ? 'Ativo' : 'Inativo'}</span
				>
			</div>
			<div class="flex items-center justify-between py-2">
				<span class="text-surface-950-50">Biometria</span>
				<span
					class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium {s
						.security.biometrics
						? 'bg-gain-500/12 text-gain-400'
						: 'bg-surface-400-600/10 text-surface-400-600'}"
					>{s.security.biometrics ? 'Ativo' : 'Inativo'}</span
				>
			</div>
		</div>
	</section>
</div>
