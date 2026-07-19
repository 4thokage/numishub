<script lang="ts">
	import { themeMode, toggleTheme } from '$lib/stores/theme';
	import Icon from '../ui/Icon.svelte';
</script>

<button
	type="button"
	onclick={toggleTheme}
	aria-label={$themeMode === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
	class="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-400-600/10 text-surface-400-600 transition-fast hover:text-surface-950-50"
>
	<Icon name={$themeMode === 'dark' ? 'sun' : 'moon'} size={18} />
</button>
