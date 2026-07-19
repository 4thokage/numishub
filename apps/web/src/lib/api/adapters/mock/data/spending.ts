import type { MonthlySpendingDto } from '$lib/types/dto';
import type { TransactionCategory } from '$lib/types/domain';
import { mulberry32, round2 } from './series';

const categories: TransactionCategory[] = [
	'groceries',
	'food',
	'transport',
	'shopping',
	'entertainment',
	'utilities',
	'housing',
	'health',
	'travel',
	'other'
];

const baseByCategory: Record<TransactionCategory, number> = {
	groceries: 320,
	food: 140,
	transport: 55,
	shopping: 130,
	entertainment: 32,
	utilities: 95,
	housing: 850,
	health: 38,
	travel: 60,
	other: 45,
	salary: 0,
	dividend: 0,
	investment: 0
};

export function buildMonthlySpending(months = 6, seed = 909): MonthlySpendingDto[] {
	const rng = mulberry32(seed);
	const out: MonthlySpendingDto[] = [];
	const cursor = new Date();
	cursor.setDate(1);
	cursor.setMonth(cursor.getMonth() - (months - 1));
	for (let i = 0; i < months; i++) {
		const byCategory = categories.map((category) => {
			const noise = (rng() - 0.5) * baseByCategory[category] * 0.4;
			return { category, amount: round2(Math.max(0, baseByCategory[category] + noise)) };
		});
		const total = round2(byCategory.reduce((s, c) => s + c.amount, 0));
		out.push({ month: cursor.toISOString(), total, by_category: byCategory });
		cursor.setMonth(cursor.getMonth() + 1);
	}
	return out;
}

export const monthlySpendingDto: MonthlySpendingDto[] = buildMonthlySpending();

export const currentMonthSpending = monthlySpendingDto[monthlySpendingDto.length - 1];
export const previousMonthSpending = monthlySpendingDto[monthlySpendingDto.length - 2];

export const spendingTrendPct =
	previousMonthSpending.total > 0
		? ((currentMonthSpending.total - previousMonthSpending.total) / previousMonthSpending.total) *
			100
		: 0;
