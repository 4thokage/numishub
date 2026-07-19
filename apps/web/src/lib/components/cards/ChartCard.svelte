<script lang="ts">
	import type { Snippet } from 'svelte';
	import SectionHeader from '../ui/SectionHeader.svelte';

	interface Props {
		title: string;
		subtitle?: string;
		action?: Snippet;
		height?: string;
		children: Snippet;
	}

	let { title, subtitle, action, height = '260px', children }: Props = $props();
</script>

<div class="panel p-5">
	<SectionHeader {title} {subtitle} {action} />
	<div class="mt-4 w-full" style:height>
		{@render children()}
	</div>
</div>
