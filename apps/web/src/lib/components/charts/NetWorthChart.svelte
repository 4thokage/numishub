<script lang="ts">
	import AreaLineChart from './AreaLineChart.svelte';
	import type { TimePoint } from '$lib/types/domain';

	interface Props {
		points: TimePoint[];
		height?: string;
	}

	let { points, height = '100%' }: Props = $props();
</script>

<AreaLineChart {points} colorToken="brand" {height} />
