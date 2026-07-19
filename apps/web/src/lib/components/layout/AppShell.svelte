<script lang="ts">
	import type { Snippet } from 'svelte';
	import Sidebar from './Sidebar.svelte';
	import BottomNav from './BottomNav.svelte';
	import MobileDrawer from './MobileDrawer.svelte';
	import PageHeader from './PageHeader.svelte';

	interface Props {
		children: Snippet;
		title?: string;
	}

	let { children, title = 'NumisHub' }: Props = $props();
</script>

<div class="relative min-h-dvh bg-surface-50-950 text-surface-950-50">
	<div
		class="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(50rem_35rem_at_75%_-15%,rgba(124,92,255,0.10),transparent)]"
	></div>
	<Sidebar />
	<MobileDrawer />
	<div class="lg:pl-64">
		<PageHeader {title} />
		<main class="mx-auto w-full max-w-6xl px-4 pt-5 pb-28 sm:px-6 lg:px-8 lg:pt-8 lg:pb-14">
			{@render children()}
		</main>
		<BottomNav />
	</div>
</div>
