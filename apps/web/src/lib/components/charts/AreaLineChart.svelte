<script lang="ts">
	import type { EChartsOption } from 'echarts';
	import ChartCanvas from './ChartCanvas.svelte';
	import { getChartColors, brandHex, hexAlpha } from '$lib/utils/chart-theme';
	import { formatCompactCurrency, formatCurrency } from '$lib/utils/format';
	import { isDark } from '$lib/stores/theme';
	import type { TimePoint } from '$lib/types/domain';

	interface Props {
		points: TimePoint[];
		colorToken?: string;
		height?: string;
	}

	let { points, colorToken = 'brand', height = '100%' }: Props = $props();

	const label = (iso: string) =>
		new Date(iso).toLocaleString('pt-PT', { month: 'short', day: '2-digit' });

	const option = $derived.by<EChartsOption>(() => {
		const c = getChartColors($isDark);
		const hex = brandHex(colorToken);
		return {
			grid: { left: 6, right: 14, top: 14, bottom: 4, containLabel: true },
			tooltip: {
				trigger: 'axis',
				backgroundColor: c.tooltipBg,
				borderColor: c.tooltipBorder,
				textStyle: { color: c.text, fontSize: 12 },
				formatter: (p: unknown) => {
					const arr = p as { axisValue: string; data: number }[];
					return `${arr[0].axisValue}<br/><b>${formatCurrency(arr[0].data)}</b>`;
				}
			},
			xAxis: {
				type: 'category',
				data: points.map((p) => label(p.date)),
				boundaryGap: false,
				axisLine: { show: false },
				axisTick: { show: false },
				axisLabel: { color: c.axisWeak, fontSize: 11 }
			},
			yAxis: {
				type: 'value',
				scale: true,
				splitLine: { lineStyle: { color: c.split } },
				axisLabel: {
					color: c.axisWeak,
					fontSize: 11,
					formatter: (v: number) => formatCompactCurrency(v)
				}
			},
			series: [
				{
					type: 'line',
					smooth: true,
					showSymbol: false,
					lineStyle: { width: 2.5, color: hex },
					areaStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{ offset: 0, color: hexAlpha(hex, 0.3) },
								{ offset: 1, color: hexAlpha(hex, 0.01) }
							]
						}
					},
					data: points.map((p) => p.value)
				}
			]
		};
	});
</script>

<ChartCanvas {option} {height} class="w-full" />
