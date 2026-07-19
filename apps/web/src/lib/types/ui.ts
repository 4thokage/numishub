/**
 * UI view models — the shapes components actually consume.
 * Components derive these from domain models via `mappers.ts`.
 * Keeping them separate means the presentation logic is isolated from
 * both the domain and the wire format.
 */

import type { CurrencyCode, InsightTone, TransactionCategory } from './domain';

export type TrendDirection = 'up' | 'down' | 'flat';

export interface Trend {
	direction: TrendDirection;
	/** Signed percentage change (e.g. +4.2 or -1.8). */
	pct: number;
}

export type ValueFormat = 'currency' | 'percent' | 'number';

export interface StatCardData {
	label: string;
	value: number;
	format: ValueFormat;
	currency: CurrencyCode;
	trend: Trend;
	icon: string;
	/** Tailwind color token base for the icon chip, e.g. 'brand'. */
	accentToken: string;
	footnote?: string;
}

export interface AllocationSliceUi {
	label: string;
	value: number;
	pct: number;
	colorToken: string;
}

export interface GoalProgressUi {
	id: string;
	name: string;
	category: string;
	pct: number;
	current: number;
	target: number;
	currency: CurrencyCode;
	colorToken: string;
	icon: string;
	projectedDate: string;
	onTrack: boolean;
	monthlyContribution: number;
}

export interface TransactionRowUi {
	id: string;
	date: string;
	merchant: string;
	category: TransactionCategory;
	amount: number;
	currency: CurrencyCode;
	isRecurring: boolean;
	pending: boolean;
	accountName: string;
}

export interface HoldingRowUi {
	id: string;
	symbol: string;
	name: string;
	assetClass: string;
	value: number;
	gain: number;
	gainPct: number;
	dayChangePct: number;
	currency: CurrencyCode;
	colorToken: string;
}

export interface InsightCardData {
	id: string;
	title: string;
	body: string;
	tone: InsightTone;
	icon: string;
}

export interface ProviderRowUi {
	id: string;
	name: string;
	status: string;
	accountsCount: number;
	lastSyncedAt: string;
}

export interface NavItem {
	href: string;
	label: string;
	icon: string;
}
