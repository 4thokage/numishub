<script lang="ts">
	interface Props {
		variant?: 'text' | 'card' | 'circle' | 'row';
		class?: string;
		count?: number;
	}

	let { variant = 'text', class: klass = '', count = 1 }: Props = $props();

	const base = 'animate-pulse bg-surface-400-600/15';
</script>

{#if variant === 'text'}
	<div class="space-y-2 {klass}">
		{#each Array(count) as _, i (i)}
			<div class="{base} h-3 rounded-full" style="width: {55 + ((i * 13) % 40)}%"></div>
		{/each}
	</div>
{:else if variant === 'circle'}
	<div class="{base} {klass} h-12 w-12 rounded-full"></div>
{:else if variant === 'row'}
	<div class="flex items-center gap-3 {klass}">
		<div class="{base} h-10 w-10 rounded-xl"></div>
		<div class="flex-1 space-y-2">
			<div class="{base} h-3 w-2/5 rounded-full"></div>
			<div class="{base} h-2.5 w-1/4 rounded-full"></div>
		</div>
		<div class="{base} h-4 w-16 rounded-full"></div>
	</div>
{:else}
	<div class="{base} {klass} h-32 w-full rounded-xl"></div>
{/if}
