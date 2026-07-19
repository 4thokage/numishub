import type { AllocationSliceDto, PortfolioSummaryDto } from '$lib/types/dto';
import { holdingsDto } from './holdings';
import { monthlySeries } from './series';

const valueOf = (h: (typeof holdingsDto)[number]) => h.quantity * h.current_price;
const costOf = (h: (typeof holdingsDto)[number]) => h.quantity * h.avg_cost;

export const totalValue = holdingsDto.reduce((s, h) => s + valueOf(h), 0);
export const totalCost = holdingsDto.reduce((s, h) => s + costOf(h), 0);
export const totalGain = totalValue - totalCost;
export const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

const dayChange = holdingsDto.reduce((s, h) => s + (h.day_change_pct / 100) * valueOf(h), 0);
const dayChangePct = totalValue > 0 ? (dayChange / totalValue) * 100 : 0;

function buildAllocation(): AllocationSliceDto[] {
	const groups: Record<string, { label: string; colorToken: string; value: number }> = {
		etf: { label: 'ETFs', colorToken: 'brand', value: 0 },
		stock: { label: 'Ações', colorToken: 'gain', value: 0 },
		crypto: { label: 'Crypto', colorToken: 'warn', value: 0 }
	};
	for (const h of holdingsDto) {
		const g = groups[h.asset_class];
		if (g) g.value += valueOf(h);
	}
	return Object.values(groups).map((g) => ({
		label: g.label,
		color_token: g.colorToken,
		value: Math.round(g.value * 100) / 100
	}));
}

export const portfolioDto: PortfolioSummaryDto = {
	total_value: Math.round(totalValue * 100) / 100,
	total_cost: Math.round(totalCost * 100) / 100,
	total_gain: Math.round(totalGain * 100) / 100,
	total_gain_pct: Math.round(totalGainPct * 100) / 100,
	day_change: Math.round(dayChange * 100) / 100,
	day_change_pct: Math.round(dayChangePct * 100) / 100,
	currency: 'EUR',
	history: monthlySeries(12, totalCost * 0.82, totalValue / 16, totalValue * 0.05, 201),
	allocation: buildAllocation()
};
