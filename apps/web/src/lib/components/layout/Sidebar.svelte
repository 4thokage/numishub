<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '../ui/Icon.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { navItems } from './nav';
	import { closeMobileNav } from '$lib/stores/ui';

	let pathname = $derived($page.url.pathname);

	const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
</script>

<aside
	class="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-surface-300-700/30 bg-surface-100-900 px-4 py-6 lg:flex"
>
	<div class="flex items-center gap-2.5 px-2">
		<div
			class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-[var(--shadow-glow)]"
		>
			<Icon name="wallet" size={20} />
		</div>
		<span class="text-lg font-semibold tracking-tight">NumisHub</span>
	</div>

	<nav class="mt-8 flex flex-1 flex-col gap-1">
		{#each navItems as item (item.href)}
			<a
				href={item.href}
				onclick={closeMobileNav}
				aria-current={isActive(item.href) ? 'page' : undefined}
				class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-fast {isActive(
					item.href
				)
					? 'bg-brand-500/12 text-brand-300'
					: 'text-surface-400-600 hover:bg-surface-400-600/10 hover:text-surface-950-50'}"
			>
				<Icon name={item.icon} size={19} />
				{item.label}
			</a>
		{/each}
	</nav>

	<div class="mt-4 flex items-center justify-between rounded-2xl bg-surface-400-600/10 px-3 py-3">
		<div class="flex items-center gap-2.5">
			<div
				class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/20 text-sm font-semibold text-brand-300"
			>
				JS
			</div>
			<div class="leading-tight">
				<p class="text-sm font-medium text-surface-950-50">João Silva</p>
				<p class="text-xs text-surface-400-600">Plano Gratuito</p>
			</div>
		</div>
		<ThemeToggle />
	</div>
</aside>
