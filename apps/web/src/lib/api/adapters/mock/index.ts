import type { ApiAdapter, InsightSection, Paginated, TransactionQuery } from '../../types';
import type {
	AccountDto,
	CreateGoalInput,
	DashboardDto,
	GoalDto,
	HoldingDto,
	InsightDto,
	MonthlySpendingDto,
	PortfolioSummaryDto,
	ProviderDto,
	SettingsDto,
	TransactionDto
} from '$lib/types/dto';

import { accountsDto } from './data/accounts';
import { transactionsDto } from './data/transactions';
import { holdingsDto } from './data/holdings';
import { portfolioDto } from './data/portfolio';
import { goalsDto } from './data/goals';
import { dashboardDto } from './data/dashboard';
import { monthlySpendingDto } from './data/spending';
import { settingsDto, providersDto } from './data/settings';
import {
	dashboardInsight,
	transactionsInsight,
	investmentsInsight,
	goalsInsight
} from './data/insights';

const delay = (ms = 280) => new Promise((r) => setTimeout(r, ms));

export class MockAdapter implements ApiAdapter {
	async getDashboard(): Promise<DashboardDto> {
		await delay();
		return dashboardDto;
	}

	async listTransactions(query: TransactionQuery = {}): Promise<Paginated<TransactionDto>> {
		await delay();
		const page = Math.max(1, query.page ?? 1);
		const pageSize = query.pageSize ?? 20;
		const search = query.search?.trim().toLowerCase();
		const category = query.category ?? 'all';
		const type = query.type ?? 'all';

		let items = transactionsDto;
		if (search) {
			items = items.filter(
				(t) =>
					t.merchant.toLowerCase().includes(search) ||
					t.description.toLowerCase().includes(search) ||
					(t.notes?.toLowerCase().includes(search) ?? false)
			);
		}
		if (category !== 'all') items = items.filter((t) => t.category === category);
		if (type === 'income') items = items.filter((t) => t.amount > 0);
		if (type === 'expense') items = items.filter((t) => t.amount < 0);

		const total = items.length;
		const start = (page - 1) * pageSize;
		const slice = items.slice(start, start + pageSize);
		return {
			items: slice,
			page,
			pageSize,
			total,
			hasMore: start + pageSize < total
		};
	}

	async getTransaction(id: string): Promise<TransactionDto | null> {
		await delay(120);
		return transactionsDto.find((t) => t.id === id) ?? null;
	}

	async listInvestments(): Promise<HoldingDto[]> {
		await delay();
		return holdingsDto;
	}

	async getHolding(id: string): Promise<HoldingDto | null> {
		await delay(120);
		return holdingsDto.find((h) => h.id === id) ?? null;
	}

	async getPortfolio(): Promise<PortfolioSummaryDto> {
		await delay();
		return portfolioDto;
	}

	async listGoals(): Promise<GoalDto[]> {
		await delay();
		return goalsDto;
	}

	async createGoal(input: CreateGoalInput): Promise<GoalDto> {
		await delay(360);
		const goal: GoalDto = {
			id: `goal-${Date.now()}`,
			name: input.name,
			category: input.category,
			target_amount: input.target_amount,
			current_amount: input.current_amount ?? 0,
			currency: 'EUR',
			target_date: input.target_date,
			monthly_contribution: input.monthly_contribution,
			color_token: input.color_token,
			icon: input.icon,
			created_at: new Date().toISOString(),
			contributions: []
		};
		goalsDto.unshift(goal);
		return goal;
	}

	async listAccounts(): Promise<AccountDto[]> {
		await delay();
		return accountsDto;
	}

	async getAccount(id: string): Promise<AccountDto | null> {
		await delay(120);
		return accountsDto.find((a) => a.id === id) ?? null;
	}

	async listMonthlySpending(): Promise<MonthlySpendingDto[]> {
		await delay();
		return monthlySpendingDto;
	}

	async getSettings(): Promise<SettingsDto> {
		await delay();
		return settingsDto;
	}

	async listProviders(): Promise<ProviderDto[]> {
		await delay();
		return providersDto;
	}

	async getInsight(section: InsightSection): Promise<InsightDto> {
		await delay(80);
		const map: Record<InsightSection, InsightDto> = {
			dashboard: dashboardInsight,
			transactions: transactionsInsight,
			investments: investmentsInsight,
			goals: goalsInsight
		};
		return map[section];
	}
}
