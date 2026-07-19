/**
 * API DTOs — the exact wire format a future backend would return.
 * Snake-cased, transport-oriented. The app NEVER consumes these directly:
 * the adapter layer maps DTO → domain via `mappers.ts`.
 *
 * Reuses the shared string-literal unions (AccountType, etc.) so the
 * mapper stays a pure shape transformation.
 */

import type {
	AccountType,
	AssetClass,
	ConnectionStatus,
	CurrencyCode,
	GoalCategory,
	InsightTone,
	TimePoint,
	TransactionCategory
} from './domain';

export interface AccountDto {
	id: string;
	name: string;
	institution: string;
	type: AccountType;
	balance: number;
	currency: CurrencyCode;
	status: ConnectionStatus;
	last_synced_at: string;
	mask: string;
	color_token: string;
	history: TimePoint[];
}

export interface TransactionDto {
	id: string;
	date: string;
	merchant: string;
	description: string;
	amount: number;
	currency: CurrencyCode;
	category: TransactionCategory;
	account_id: string;
	account_name: string;
	notes?: string;
	is_recurring: boolean;
	pending: boolean;
	has_receipt: boolean;
}

export interface HoldingDto {
	id: string;
	symbol: string;
	name: string;
	asset_class: AssetClass;
	quantity: number;
	avg_cost: number;
	current_price: number;
	currency: CurrencyCode;
	account_id: string;
	day_change_pct: number;
	history: TimePoint[];
}

export interface AllocationSliceDto {
	label: string;
	value: number;
	color_token: string;
}

export interface PortfolioSummaryDto {
	total_value: number;
	total_cost: number;
	total_gain: number;
	total_gain_pct: number;
	day_change: number;
	day_change_pct: number;
	currency: CurrencyCode;
	history: TimePoint[];
	allocation: AllocationSliceDto[];
}

export interface GoalDto {
	id: string;
	name: string;
	category: GoalCategory;
	target_amount: number;
	current_amount: number;
	currency: CurrencyCode;
	target_date: string;
	monthly_contribution: number;
	color_token: string;
	icon: string;
	created_at: string;
	contributions: TimePoint[];
}

export interface InsightDto {
	id: string;
	title: string;
	body: string;
	tone: InsightTone;
	icon: string;
}

export interface MonthlySpendingDto {
	month: string;
	total: number;
	by_category: { category: TransactionCategory; amount: number }[];
}

export interface DashboardDto {
	net_worth: number;
	net_worth_history: TimePoint[];
	monthly_change: number;
	monthly_change_pct: number;
	cash: number;
	investments: number;
	debt: number;
	monthly_spending: number;
	monthly_spending_trend_pct: number;
	top_goals: GoalDto[];
	recent_transactions: TransactionDto[];
	allocation: AllocationSliceDto[];
	insight: InsightDto;
}

export interface ProviderDto {
	id: string;
	name: string;
	status: ConnectionStatus;
	accounts_count: number;
	last_synced_at: string;
}

export interface CreateGoalInput {
	name: string;
	category: GoalCategory;
	target_amount: number;
	current_amount?: number;
	target_date: string;
	monthly_contribution: number;
	color_token: string;
	icon: string;
}

export interface SettingsDto {
	profile: { name: string; email: string; avatar_initials: string };
	appearance: { theme: 'dark' | 'light'; density: 'comfortable' | 'compact' };
	notifications: {
		insights: boolean;
		large_transactions: boolean;
		goal_milestones: boolean;
		weekly: boolean;
	};
	currency: CurrencyCode;
	export: { format: 'csv' | 'pdf'; auto: boolean };
	security: { two_factor: boolean; biometrics: boolean; pin_lock: boolean };
}
