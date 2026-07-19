<script lang="ts">
	import * as echarts from 'echarts/core';
	import { LineChart, BarChart, PieChart } from 'echarts/charts';
	import {
		GridComponent,
		TooltipComponent,
		LegendComponent,
		GraphicComponent
	} from 'echarts/components';
	import { CanvasRenderer } from 'echarts/renderers';
	import type { EChartsOption } from 'echarts';

	echarts.use([
		LineChart,
		BarChart,
		PieChart,
		GridComponent,
		TooltipComponent,
		LegendComponent,
		GraphicComponent,
		CanvasRenderer
	]);

	interface Props {
		/** Full ECharts option. Typed wrappers own this — pages never build it. */
		option: EChartsOption;
		class?: string;
		height?: string;
	}

	let { option, class: klass = '', height = '100%' }: Props = $props();

	let el = $state<HTMLDivElement>();
	let chart = $state<echarts.ECharts>();

	$effect(() => {
		if (!el) return;
		const instance = echarts.init(el, undefined, { renderer: 'canvas' });
		chart = instance;
		const ro = new ResizeObserver(() => instance.resize());
		ro.observe(el);
		return () => {
			ro.disconnect();
			instance.dispose();
		};
	});

	$effect(() => {
		// Re-applies whenever `option` (or theme-derived colors) change.
		const current = option;
		chart?.setOption(current, true);
	});
</script>

<div bind:this={el} class={klass} style:height role="img"></div>
