import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'numishub:theme';

function initialMode(): ThemeMode {
	if (!browser) return 'dark';
	return (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'dark';
}

export const themeMode = writable<ThemeMode>(initialMode());

if (browser) {
	themeMode.subscribe((mode) => {
		const root = document.documentElement;
		root.classList.toggle('dark', mode === 'dark');
		root.classList.toggle('light', mode === 'light');
		localStorage.setItem(STORAGE_KEY, mode);
	});
}

export const isDark = derived(themeMode, ($mode) => $mode === 'dark');

export function toggleTheme(): void {
	themeMode.update((m) => (m === 'dark' ? 'light' : 'dark'));
}

export function setTheme(mode: ThemeMode): void {
	themeMode.set(mode);
}
