<script lang="ts">
	import type { EChartsOption } from 'echarts';
	import ChartCanvas from './ChartCanvas.svelte';
	import { getChartColors, brandHex } from '$lib/utils/chart-theme';
	import { formatCompactCurrency } from '$lib/utils/format';
	import { isDark } from '$lib/stores/theme';
	import type { AllocationSliceUi } from '$lib/types/ui';

	interface Props {
		slices: AllocationSliceUi[];
		height?: string;
	}

	let { slices, height = '100%' }: Props = $props();

	const option = $derived.by<EChartsOption>(() => {
		const c = getChartColors($isDark);
		return {
			tooltip: {
				trigger: 'item',
				backgroundColor: c.tooltipBg,
				borderColor: c.tooltipBorder,
				textStyle: { color: c.text, fontSize: 12 },
				formatter: (p: unknown) => {
					const d = p as { name: string; value: number; percent: number };
					return `${d.name}<br/><b>${formatCompactCurrency(d.value)}</b> (${d.percent}%)`;
				}
			},
			series: [
				{
					type: 'pie',
					radius: ['62%', '90%'],
					center: ['50%', '50%'],
					avoidLabelOverlap: false,
					label: { show: false },
					labelLine: { show: false },
					itemStyle: { borderColor: c.surface, borderWidth: 3, borderRadius: 6 },
					data: slices.map((s) => ({
						name: s.label,
						value: s.value,
						itemStyle: { color: brandHex(s.colorToken) }
					}))
				}
			]
		};
	});
</script>

<ChartCanvas {option} {height} class="w-full" />
