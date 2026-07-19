import { writable } from 'svelte/store';

export const mobileNavOpen = writable(false);

export function openMobileNav(): void {
	mobileNavOpen.set(true);
}

export function closeMobileNav(): void {
	mobileNavOpen.set(false);
}

export function toggleMobileNav(): void {
	mobileNavOpen.update((v) => !v);
}
