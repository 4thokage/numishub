/**
 * Mappers — pure transformations between the three type layers.
 *   DTO  → Domain   (adapter layer)
 *   Domain → UI     (presentation layer)
 * No component imports a DTO; no mapper touches the DOM.
 */

import type {
	Account,
	AllocationSlice,
	DashboardData,
	Goal,
	Holding,
	Insight,
	MonthlySpending,
	PortfolioSummary,
	Provider,
	Settings,
	Transaction
} from './domain';
import type {
	AccountDto,
	AllocationSliceDto,
	DashboardDto,
	GoalDto,
	HoldingDto,
	InsightDto,
	MonthlySpendingDto,
	PortfolioSummaryDto,
	ProviderDto,
	SettingsDto,
	TransactionDto
} from './dto';
import type {
	AllocationSliceUi,
	GoalProgressUi,
	HoldingRowUi,
	InsightCardData,
	ProviderRowUi,
	TransactionRowUi
} from './ui';

/* ── DTO → Domain ──────────────────────────────────────────────────────── */

export const toAccount = (d: AccountDto): Account => ({
	id: d.id,
	name: d.name,
	institution: d.institution,
	type: d.type,
	balance: d.balance,
	currency: d.currency,
	status: d.status,
	lastSyncedAt: d.last_synced_at,
	mask: d.mask,
	colorToken: d.color_token,
	history: d.history
});

export const toTransaction = (d: TransactionDto): Transaction => ({
	id: d.id,
	date: d.date,
	merchant: d.merchant,
	description: d.description,
	amount: d.amount,
	currency: d.currency,
	category: d.category,
	accountId: d.account_id,
	accountName: d.account_name,
	notes: d.notes,
	isRecurring: d.is_recurring,
	pending: d.pending,
	hasReceipt: d.has_receipt
});

export const toHolding = (d: HoldingDto): Holding => ({
	id: d.id,
	symbol: d.symbol,
	name: d.name,
	assetClass: d.asset_class,
	quantity: d.quantity,
	avgCost: d.avg_cost,
	currentPrice: d.current_price,
	currency: d.currency,
	accountId: d.account_id,
	dayChangePct: d.day_change_pct,
	history: d.history
});

export const toGoal = (d: GoalDto): Goal => ({
	id: d.id,
	name: d.name,
	category: d.category,
	targetAmount: d.target_amount,
	currentAmount: d.current_amount,
	currency: d.currency,
	targetDate: d.target_date,
	monthlyContribution: d.monthly_contribution,
	colorToken: d.color_token,
	icon: d.icon,
	createdAt: d.created_at,
	contributions: d.contributions
});

export const toInsight = (d: InsightDto): Insight => ({
	id: d.id,
	title: d.title,
	body: d.body,
	tone: d.tone,
	icon: d.icon
});

export const toAllocationSlice = (d: AllocationSliceDto): AllocationSlice => ({
	label: d.label,
	value: d.value,
	colorToken: d.color_token
});

export const toPortfolioSummary = (d: PortfolioSummaryDto): PortfolioSummary => ({
	totalValue: d.total_value,
	totalCost: d.total_cost,
	totalGain: d.total_gain,
	totalGainPct: d.total_gain_pct,
	dayChange: d.day_change,
	dayChangePct: d.day_change_pct,
	currency: d.currency,
	history: d.history,
	allocation: d.allocation.map(toAllocationSlice)
});

export const toProvider = (d: ProviderDto): Provider => ({
	id: d.id,
	name: d.name,
	status: d.status,
	accountsCount: d.accounts_count,
	lastSyncedAt: d.last_synced_at
});

export const toSettings = (d: SettingsDto): Settings => ({
	profile: {
		name: d.profile.name,
		email: d.profile.email,
		avatarInitials: d.profile.avatar_initials
	},
	appearance: d.appearance,
	notifications: {
		insights: d.notifications.insights,
		largeTransactions: d.notifications.large_transactions,
		goalMilestones: d.notifications.goal_milestones,
		weekly: d.notifications.weekly
	},
	currency: d.currency,
	export: d.export,
	security: {
		twoFactor: d.security.two_factor,
		biometrics: d.security.biometrics,
		pinLock: d.security.pin_lock
	}
});

export const toMonthlySpending = (d: MonthlySpendingDto): MonthlySpending => ({
	month: d.month,
	total: d.total,
	byCategory: d.by_category
});

export const toDashboard = (d: DashboardDto): DashboardData => ({
	netWorth: d.net_worth,
	netWorthHistory: d.net_worth_history,
	monthlyChange: d.monthly_change,
	monthlyChangePct: d.monthly_change_pct,
	cash: d.cash,
	investments: d.investments,
	debt: d.debt,
	monthlySpending: d.monthly_spending,
	monthlySpendingTrendPct: d.monthly_spending_trend_pct,
	topGoals: d.top_goals.map(toGoal),
	recentTransactions: d.recent_transactions.map(toTransaction),
	allocation: d.allocation.map(toAllocationSlice),
	insight: toInsight(d.insight)
});

/* ── Domain → UI ──────────────────────────────────────────────────────── */

const addMonths = (iso: string, months: number): string => {
	const d = new Date(iso);
	d.setMonth(d.getMonth() + months);
	return d.toISOString();
};

export const toAllocationSliceUi = (slice: AllocationSlice, total: number): AllocationSliceUi => ({
	label: slice.label,
	value: slice.value,
	pct: total > 0 ? (slice.value / total) * 100 : 0,
	colorToken: slice.colorToken
});

export const toGoalProgressUi = (g: Goal): GoalProgressUi => {
	const pct = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
	const remaining = Math.max(g.targetAmount - g.currentAmount, 0);
	const monthsToGoal =
		g.monthlyContribution > 0 ? Math.ceil(remaining / g.monthlyContribution) : Infinity;
	const projectedDate =
		Number.isFinite(monthsToGoal) && monthsToGoal > 0
			? addMonths(new Date().toISOString(), monthsToGoal)
			: g.targetDate;
	const onTrack = new Date(projectedDate) <= new Date(g.targetDate);
	return {
		id: g.id,
		name: g.name,
		category: g.category,
		pct,
		current: g.currentAmount,
		target: g.targetAmount,
		currency: g.currency,
		colorToken: g.colorToken,
		icon: g.icon,
		projectedDate,
		onTrack,
		monthlyContribution: g.monthlyContribution
	};
};

export const toTransactionRowUi = (t: Transaction): TransactionRowUi => ({
	id: t.id,
	date: t.date,
	merchant: t.merchant,
	category: t.category,
	amount: t.amount,
	currency: t.currency,
	isRecurring: t.isRecurring,
	pending: t.pending,
	accountName: t.accountName
});

export const toHoldingRowUi = (h: Holding): HoldingRowUi => {
	const value = h.quantity * h.currentPrice;
	const cost = h.quantity * h.avgCost;
	const gain = value - cost;
	const gainPct = cost > 0 ? (gain / cost) * 100 : 0;
	const colorToken = resolveAssetColor(h.assetClass);
	return {
		id: h.id,
		symbol: h.symbol,
		name: h.name,
		assetClass: h.assetClass,
		value,
		gain,
		gainPct,
		dayChangePct: h.dayChangePct,
		currency: h.currency,
		colorToken
	};
};

export const toInsightCardData = (i: Insight): InsightCardData => ({
	id: i.id,
	title: i.title,
	body: i.body,
	tone: i.tone,
	icon: i.icon
});

export const toProviderRowUi = (p: Provider): ProviderRowUi => ({
	id: p.id,
	name: p.name,
	status: p.status,
	accountsCount: p.accountsCount,
	lastSyncedAt: p.lastSyncedAt
});

/** Stable color assignment per asset class for charts/cards. */
export const resolveAssetColor = (assetClass: string): string => {
	switch (assetClass) {
		case 'etf':
			return 'brand';
		case 'stock':
			return 'gain';
		case 'crypto':
			return 'warn';
		default:
			return 'surface';
	}
};
