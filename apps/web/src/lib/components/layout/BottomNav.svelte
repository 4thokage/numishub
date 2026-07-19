<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '../ui/Icon.svelte';
	import { bottomNavItems } from './nav';
	import { closeMobileNav } from '$lib/stores/ui';

	let pathname = $derived($page.url.pathname);

	const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
</script>

<nav
	class="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-surface-300-700/30 bg-surface-100-900/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
	aria-label="Navegação principal"
>
	{#each bottomNavItems as item (item.href)}
		<a
			href={item.href}
			onclick={closeMobileNav}
			aria-current={isActive(item.href) ? 'page' : undefined}
			class="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-fast {isActive(
				item.href
			)
				? 'text-brand-300'
				: 'text-surface-400-600'}"
		>
			<Icon name={item.icon} size={22} />
			{item.label}
		</a>
	{/each}
</nav>
