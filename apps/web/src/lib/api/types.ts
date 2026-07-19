/**
 * Transport contract. The UI never imports this directly — it goes through
 * the facade in `./index.ts`. Both the mock and (future) HTTP adapters
 * implement `ApiAdapter`, returning raw DTOs exactly as a backend would.
 */

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
import type { TransactionCategory } from '$lib/types/domain';

export type InsightSection = 'dashboard' | 'transactions' | 'investments' | 'goals';

export interface TransactionQuery {
	page?: number;
	pageSize?: number;
	search?: string;
	category?: TransactionCategory | 'all';
	type?: 'income' | 'expense' | 'all';
}

export interface Paginated<T> {
	items: T[];
	page: number;
	pageSize: number;
	total: number;
	hasMore: boolean;
}

export interface ApiAdapter {
	getDashboard(): Promise<DashboardDto>;
	listTransactions(query?: TransactionQuery): Promise<Paginated<TransactionDto>>;
	getTransaction(id: string): Promise<TransactionDto | null>;
	listInvestments(): Promise<HoldingDto[]>;
	getHolding(id: string): Promise<HoldingDto | null>;
	getPortfolio(): Promise<PortfolioSummaryDto>;
	listGoals(): Promise<GoalDto[]>;
	createGoal(input: CreateGoalInput): Promise<GoalDto>;
	listAccounts(): Promise<AccountDto[]>;
	getAccount(id: string): Promise<AccountDto | null>;
	listMonthlySpending(): Promise<MonthlySpendingDto[]>;
	getSettings(): Promise<SettingsDto>;
	listProviders(): Promise<ProviderDto[]>;
	getInsight(section: InsightSection): Promise<InsightDto>;
}
