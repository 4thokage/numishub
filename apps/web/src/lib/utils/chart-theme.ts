/**
 * Chart theming for ECharts. Canvas cannot read CSS variables, so we map the
 * design-token palette to concrete colors and switch with the app theme.
 */

export interface ChartColors {
	axis: string;
	axisWeak: string;
	split: string;
	surface: string;
	text: string;
	tooltipBg: string;
	tooltipBorder: string;
}

const dark: ChartColors = {
	axis: 'rgba(255,255,255,0.55)',
	axisWeak: 'rgba(255,255,255,0.32)',
	split: 'rgba(255,255,255,0.08)',
	surface: 'rgba(255,255,255,0.04)',
	text: 'rgba(255,255,255,0.88)',
	tooltipBg: 'rgba(20,20,28,0.92)',
	tooltipBorder: 'rgba(255,255,255,0.10)'
};

const light: ChartColors = {
	axis: 'rgba(15,23,42,0.62)',
	axisWeak: 'rgba(15,23,42,0.40)',
	split: 'rgba(15,23,42,0.08)',
	surface: 'rgba(15,23,42,0.03)',
	text: 'rgba(15,23,42,0.85)',
	tooltipBg: 'rgba(255,255,255,0.96)',
	tooltipBorder: 'rgba(15,23,42,0.10)'
};

export function getChartColors(isDark: boolean): ChartColors {
	return isDark ? dark : light;
}

/** Concrete hex for a brand token, used for series/legend colors. */
export function brandHex(token: string): string {
	switch (token) {
		case 'brand':
			return '#7c5cff';
		case 'gain':
			return '#10b981';
		case 'loss':
			return '#f43f5e';
		case 'warn':
			return '#f59e0b';
		case 'surface':
			return '#94a3b8';
		default:
			return '#7c5cff';
	}
}

/** Apply an alpha channel to a #rrggbb hex color. */
export function hexAlpha(hex: string, alpha: number): string {
	const h = hex.replace('#', '');
	const r = parseInt(h.slice(0, 2), 16);
	const g = parseInt(h.slice(2, 4), 16);
	const b = parseInt(h.slice(4, 6), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
