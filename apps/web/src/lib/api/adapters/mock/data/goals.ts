import type { GoalDto } from '$lib/types/dto';
import { monthlySeries } from './series';

const now = new Date();

const addMonths = (months: number): string => {
	const d = new Date(now);
	d.setMonth(d.getMonth() + months);
	return d.toISOString();
};

export const goalsDto: GoalDto[] = [
	{
		id: 'goal-emergency',
		name: 'Fundo de Emergência',
		category: 'emergency',
		target_amount: 10000,
		current_amount: 7200,
		currency: 'EUR',
		target_date: addMonths(14),
		monthly_contribution: 400,
		color_token: 'gain',
		icon: 'shield',
		created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 240).toISOString(),
		contributions: monthlySeries(10, 280, 6, 40, 301)
	},
	{
		id: 'goal-japan',
		name: 'Viagem ao Japão',
		category: 'travel',
		target_amount: 4500,
		current_amount: 1820,
		currency: 'EUR',
		target_date: addMonths(11),
		monthly_contribution: 250,
		color_token: 'brand',
		icon: 'plane',
		created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 150).toISOString(),
		contributions: monthlySeries(8, 150, 4, 30, 302)
	},
	{
		id: 'goal-laptop',
		name: 'Novo Portátil',
		category: 'other',
		target_amount: 2200,
		current_amount: 1900,
		currency: 'EUR',
		target_date: addMonths(2),
		monthly_contribution: 150,
		color_token: 'warn',
		icon: 'laptop',
		created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 60).toISOString(),
		contributions: monthlySeries(5, 300, 5, 20, 303)
	},
	{
		id: 'goal-apartment',
		name: 'Entrada de Casa',
		category: 'home',
		target_amount: 30000,
		current_amount: 8500,
		currency: 'EUR',
		target_date: addMonths(36),
		monthly_contribution: 600,
		color_token: 'brand',
		icon: 'home',
		created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 300).toISOString(),
		contributions: monthlySeries(12, 400, 16, 80, 304)
	}
];
