/**
 * Application facade — the ONLY module UI code imports for data.
 * It calls the active adapter (mock/HTTP) and maps DTOs → domain models,
 * so pages never see wire formats and never know the data source.
 */

import { getAdapter } from './client';
import type { TransactionQuery, Paginated, InsightSection } from './types';
import type {
	Account,
	DashboardData,
	Goal,
	Holding,
	MonthlySpending,
	PortfolioSummary,
	Provider,
	Settings,
	Transaction
} from '$lib/types/domain';
import type { CreateGoalInput } from '$lib/types/dto';
import {
	toAccount,
	toDashboard,
	toGoal,
	toHolding,
	toInsight,
	toMonthlySpending,
	toPortfolioSummary,
	toProvider,
	toSettings,
	toTransaction
} from '$lib/types/mappers';

export async function getDashboard(): Promise<DashboardData> {
	return toDashboard(await getAdapter().getDashboard());
}

export async function getTransactions(query?: TransactionQuery): Promise<Paginated<Transaction>> {
	const res = await getAdapter().listTransactions(query);
	return {
		...res,
		items: res.items.map(toTransaction)
	};
}

export async function getTransaction(id: string): Promise<Transaction | null> {
	const dto = await getAdapter().getTransaction(id);
	return dto ? toTransaction(dto) : null;
}

export async function getInvestments(): Promise<Holding[]> {
	return (await getAdapter().listInvestments()).map(toHolding);
}

export async function getHolding(id: string): Promise<Holding | null> {
	const dto = await getAdapter().getHolding(id);
	return dto ? toHolding(dto) : null;
}

export async function getPortfolio(): Promise<PortfolioSummary> {
	return toPortfolioSummary(await getAdapter().getPortfolio());
}

export async function getGoals(): Promise<Goal[]> {
	return (await getAdapter().listGoals()).map(toGoal);
}

export async function createGoal(input: CreateGoalInput): Promise<Goal> {
	return toGoal(await getAdapter().createGoal(input));
}

export async function getAccounts(): Promise<Account[]> {
	return (await getAdapter().listAccounts()).map(toAccount);
}

export async function getAccount(id: string): Promise<Account | null> {
	const dto = await getAdapter().getAccount(id);
	return dto ? toAccount(dto) : null;
}

export async function getMonthlySpending(): Promise<MonthlySpending[]> {
	return (await getAdapter().listMonthlySpending()).map(toMonthlySpending);
}

export async function getSettings(): Promise<Settings> {
	return toSettings(await getAdapter().getSettings());
}

export async function getProviders(): Promise<Provider[]> {
	return (await getAdapter().listProviders()).map(toProvider);
}

export async function getInsight(section: InsightSection) {
	return toInsight(await getAdapter().getInsight(section));
}
