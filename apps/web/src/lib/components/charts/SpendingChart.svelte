<script lang="ts">
	import type { EChartsOption } from 'echarts';
	import ChartCanvas from './ChartCanvas.svelte';
	import { getChartColors, brandHex } from '$lib/utils/chart-theme';
	import { formatCompactCurrency, formatCurrency } from '$lib/utils/format';
	import { isDark } from '$lib/stores/theme';
	import { categoryMeta } from '$lib/utils/meta';
	import type { MonthlySpending } from '$lib/types/domain';

	interface Props {
		months: MonthlySpending[];
		height?: string;
	}

	let { months, height = '100%' }: Props = $props();

	const palette = [
		'gain',
		'brand',
		'warn',
		'loss',
		'surface',
		'brand',
		'warn',
		'gain',
		'loss',
		'surface'
	];

	const option = $derived.by<EChartsOption>(() => {
		const c = getChartColors($isDark);
		const categories = Array.from(
			new Set(months.flatMap((m) => m.byCategory.map((b) => b.category)))
		);
		const labels = months.map((m) => new Date(m.month).toLocaleString('pt-PT', { month: 'short' }));
		const series = categories.map((cat, i) => ({
			name: categoryMeta[cat].label,
			type: 'bar' as const,
			stack: 'total',
			barWidth: '56%',
			itemStyle: {
				color: brandHex(palette[i % palette.length]),
				borderRadius:
					i === categories.length - 1 ? ([6, 6, 0, 0] as [number, number, number, number]) : 0
			},
			data: months.map((m) => m.byCategory.find((b) => b.category === cat)?.amount ?? 0)
		}));
		return {
			grid: { left: 6, right: 10, top: 28, bottom: 4, containLabel: true },
			legend: {
				show: true,
				type: 'scroll',
				top: 0,
				textStyle: { color: c.axis, fontSize: 11 },
				itemWidth: 10,
				itemHeight: 10
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: { type: 'shadow' },
				backgroundColor: c.tooltipBg,
				borderColor: c.tooltipBorder,
				textStyle: { color: c.text, fontSize: 12 },
				formatter: (p: unknown) => {
					const arr = p as { seriesName: string; value: number; axisValue: string }[];
					const total = arr.reduce((s, x) => s + x.value, 0);
					const rows = arr
						.filter((x) => x.value > 0)
						.map((x) => `${x.seriesName}: ${formatCurrency(x.value)}`)
						.join('<br/>');
					return `${arr[0].axisValue} · ${formatCurrency(total)}<br/>${rows}`;
				}
			},
			xAxis: {
				type: 'category',
				data: labels,
				axisLine: { show: false },
				axisTick: { show: false },
				axisLabel: { color: c.axisWeak, fontSize: 11 }
			},
			yAxis: {
				type: 'value',
				splitLine: { lineStyle: { color: c.split } },
				axisLabel: {
					color: c.axisWeak,
					fontSize: 11,
					formatter: (v: number) => formatCompactCurrency(v)
				}
			},
			series
		};
	});
</script>

<ChartCanvas {option} {height} class="w-full" />
