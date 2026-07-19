/**
 * Domain models — the rich, internal representation the app reasons about.
 * These are framework-agnostic and independent of any transport format.
 */

export type CurrencyCode = 'EUR' | 'USD' | 'GBP';

export type AccountType = 'checking' | 'savings' | 'investment' | 'crypto' | 'credit';

export type ConnectionStatus = 'connected' | 'syncing' | 'error' | 'disconnected';

export type TransactionCategory =
	| 'salary'
	| 'dividend'
	| 'investment'
	| 'food'
	| 'groceries'
	| 'transport'
	| 'shopping'
	| 'entertainment'
	| 'health'
	| 'housing'
	| 'utilities'
	| 'travel'
	| 'other';

export type AssetClass = 'etf' | 'stock' | 'crypto' | 'cash';

export type GoalCategory =
	'emergency' | 'travel' | 'home' | 'education' | 'vehicle' | 'retirement' | 'other';

export type InsightTone = 'positive' | 'info' | 'warning';

/** A single point in a time series (date is an ISO string). */
export interface TimePoint {
	date: string;
	value: number;
}

export interface Account {
	id: string;
	name: string;
	institution: string;
	type: AccountType;
	balance: number;
	currency: CurrencyCode;
	status: ConnectionStatus;
	lastSyncedAt: string;
	mask: string;
	/** Tailwind color token base, e.g. 'brand' → bg-brand-500. */
	colorToken: string;
	history: TimePoint[];
}

export interface Transaction {
	id: string;
	date: string;
	merchant: string;
	description: string;
	/** Positive = money in, negative = money out. */
	amount: number;
	currency: CurrencyCode;
	category: TransactionCategory;
	accountId: string;
	accountName: string;
	notes?: string;
	isRecurring: boolean;
	pending: boolean;
	hasReceipt: boolean;
}

export interface Holding {
	id: string;
	symbol: string;
	name: string;
	assetClass: AssetClass;
	quantity: number;
	avgCost: number;
	currentPrice: number;
	currency: CurrencyCode;
	accountId: string;
	dayChangePct: number;
	history: TimePoint[];
}

export interface AllocationSlice {
	label: string;
	value: number;
	colorToken: string;
}

export interface PortfolioSummary {
	totalValue: number;
	totalCost: number;
	totalGain: number;
	totalGainPct: number;
	dayChange: number;
	dayChangePct: number;
	currency: CurrencyCode;
	history: TimePoint[];
	allocation: AllocationSlice[];
}

export interface Goal {
	id: string;
	name: string;
	category: GoalCategory;
	targetAmount: number;
	currentAmount: number;
	currency: CurrencyCode;
	targetDate: string;
	monthlyContribution: number;
	colorToken: string;
	icon: string;
	createdAt: string;
	/** Monthly contribution history (for the contribution sparkline). */
	contributions: TimePoint[];
}

export interface Insight {
	id: string;
	title: string;
	body: string;
	tone: InsightTone;
	icon: string;
}

export interface MonthlySpending {
	month: string;
	total: number;
	byCategory: { category: TransactionCategory; amount: number }[];
}

export interface DashboardData {
	netWorth: number;
	netWorthHistory: TimePoint[];
	monthlyChange: number;
	monthlyChangePct: number;
	cash: number;
	investments: number;
	debt: number;
	monthlySpending: number;
	monthlySpendingTrendPct: number;
	topGoals: Goal[];
	recentTransactions: Transaction[];
	allocation: AllocationSlice[];
	insight: Insight;
}

export interface Provider {
	id: string;
	name: string;
	status: ConnectionStatus;
	accountsCount: number;
	lastSyncedAt: string;
}

export interface Settings {
	profile: { name: string; email: string; avatarInitials: string };
	appearance: { theme: 'dark' | 'light'; density: 'comfortable' | 'compact' };
	notifications: {
		insights: boolean;
		largeTransactions: boolean;
		goalMilestones: boolean;
		weekly: boolean;
	};
	currency: CurrencyCode;
	export: { format: 'csv' | 'pdf'; auto: boolean };
	security: { twoFactor: boolean; biometrics: boolean; pinLock: boolean };
}
