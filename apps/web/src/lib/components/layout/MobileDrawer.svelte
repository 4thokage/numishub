<script lang="ts">
	import { page } from '$app/stores';
	import { fade, fly } from 'svelte/transition';
	import Icon from '../ui/Icon.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { navItems } from './nav';
	import { closeMobileNav, mobileNavOpen } from '$lib/stores/ui';

	let pathname = $derived($page.url.pathname);

	const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
</script>

{#if $mobileNavOpen}
	<div class="fixed inset-0 z-40 lg:hidden">
		<button
			type="button"
			class="absolute inset-0 bg-black/50 backdrop-blur-sm"
			aria-label="Fechar menu"
			onclick={closeMobileNav}
			transition:fade={{ duration: 150 }}
		></button>
		<div
			class="absolute inset-y-0 left-0 flex w-72 flex-col bg-surface-100-900 px-4 py-6 shadow-[var(--shadow-lift)]"
			transition:fly={{ x: -280, duration: 200 }}
		>
			<div class="flex items-center justify-between px-2">
				<div class="flex items-center gap-2.5">
					<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
						<Icon name="wallet" size={20} />
					</div>
					<span class="text-lg font-semibold tracking-tight">NumisHub</span>
				</div>
				<button
					type="button"
					onclick={closeMobileNav}
					aria-label="Fechar"
					class="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-400-600/10 text-surface-400-600"
				>
					<Icon name="x" size={18} />
				</button>
			</div>

			<nav class="mt-8 flex flex-1 flex-col gap-1">
				{#each navItems as item (item.href)}
					<a
						href={item.href}
						onclick={closeMobileNav}
						aria-current={isActive(item.href) ? 'page' : undefined}
						class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-fast {isActive(
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

			<div class="flex items-center justify-between rounded-2xl bg-surface-400-600/10 px-3 py-3">
				<div class="flex items-center gap-2.5">
					<div
						class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/20 text-sm font-semibold text-brand-300"
					>
						JS
					</div>
					<p class="text-sm font-medium text-surface-950-50">João Silva</p>
				</div>
				<ThemeToggle />
			</div>
		</div>
	</div>
{/if}
