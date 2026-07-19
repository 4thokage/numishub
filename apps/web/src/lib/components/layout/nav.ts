import type { NavItem } from '$lib/types/ui';

export const navItems: NavItem[] = [
	{ href: '/', label: 'Início', icon: 'dashboard' },
	{ href: '/transactions', label: 'Movimentos', icon: 'receipt' },
	{ href: '/investments', label: 'Investimentos', icon: 'trending-up' },
	{ href: '/goals', label: 'Objetivos', icon: 'target' },
	{ href: '/accounts', label: 'Contas', icon: 'wallet' },
	{ href: '/settings', label: 'Definições', icon: 'settings' }
];

export const bottomNavItems: NavItem[] = navItems.slice(0, 5);
