import type { ApiAdapter, Paginated, TransactionQuery } from '../../types';
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
import type { InsightSection } from '../../types';

/**
 * HTTP adapter — drop-in replacement for `MockAdapter` once a backend exists.
 * It performs the same DTO contract; the UI is unaware of which is active.
 * Endpoints are conventional REST paths; wire them up when the API ships.
 */

const BASE = '/api';

async function get<T>(path: string): Promise<T> {
	const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json' } });
	if (!res.ok) throw new Error(`Request failed: ${res.status} ${path}`);
	return (await res.json()) as T;
}

async function post<T>(path: string, body: unknown): Promise<T> {
	const res = await fetch(`${BASE}${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	if (!res.ok) throw new Error(`Request failed: ${res.status} ${path}`);
	return (await res.json()) as T;
}

export class HttpAdapter implements ApiAdapter {
	async getDashboard(): Promise<DashboardDto> {
		return get<DashboardDto>('/dashboard');
	}

	async listTransactions(query: TransactionQuery = {}): Promise<Paginated<TransactionDto>> {
		const params = new URLSearchParams();
		if (query.page) params.set('page', String(query.page));
		if (query.pageSize) params.set('pageSize', String(query.pageSize));
		if (query.search) params.set('search', query.search);
		if (query.category && query.category !== 'all') params.set('category', query.category);
		if (query.type && query.type !== 'all') params.set('type', query.type);
		const qs = params.toString();
		return get<Paginated<TransactionDto>>(`/transactions${qs ? `?${qs}` : ''}`);
	}

	async getTransaction(id: string): Promise<TransactionDto | null> {
		return get<TransactionDto | null>(`/transactions/${id}`);
	}

	async listInvestments(): Promise<HoldingDto[]> {
		return get<HoldingDto[]>('/investments');
	}

	async getHolding(id: string): Promise<HoldingDto | null> {
		return get<HoldingDto | null>(`/investments/${id}`);
	}

	async getPortfolio(): Promise<PortfolioSummaryDto> {
		return get<PortfolioSummaryDto>('/portfolio');
	}

	async listGoals(): Promise<GoalDto[]> {
		return get<GoalDto[]>('/goals');
	}

	async createGoal(input: CreateGoalInput): Promise<GoalDto> {
		return post<GoalDto>('/goals', input);
	}

	async listAccounts(): Promise<AccountDto[]> {
		return get<AccountDto[]>('/accounts');
	}

	async getAccount(id: string): Promise<AccountDto | null> {
		return get<AccountDto | null>(`/accounts/${id}`);
	}

	async listMonthlySpending(): Promise<MonthlySpendingDto[]> {
		return get<MonthlySpendingDto[]>('/spending');
	}

	async getSettings(): Promise<SettingsDto> {
		return get<SettingsDto>('/settings');
	}

	async listProviders(): Promise<ProviderDto[]> {
		return get<ProviderDto[]>('/providers');
	}

	async getInsight(section: InsightSection): Promise<InsightDto> {
		return get<InsightDto>(`/insights/${section}`);
	}
}
