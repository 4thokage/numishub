import type { DashboardDto } from '$lib/types/dto';
import { netWorth as nw, totalCash, totalInvestments, totalCrypto, totalDebt } from './accounts';
import { portfolioDto } from './portfolio';
import { goalsDto } from './goals';
import { recentTransactionsDto } from './transactions';
import { monthlySpendingDto, currentMonthSpending, spendingTrendPct } from './spending';
import { dashboardInsight } from './insights';
import { monthlySeries, round2 } from './series';

const cash = round2(totalCash);
const investments = round2(totalInvestments + totalCrypto);
const debt = round2(Math.abs(totalDebt));

const netWorthHistory = monthlySeries(12, nw * 0.78, nw / 16, nw * 0.045, 501);
const prevNetWorth = netWorthHistory[netWorthHistory.length - 2].value;
const lastNetWorth = netWorthHistory[netWorthHistory.length - 1].value;
const monthlyChange = round2(lastNetWorth - prevNetWorth);
const monthlyChangePct = round2((monthlyChange / prevNetWorth) * 100);

export const dashboardDto: DashboardDto = {
	net_worth: round2(nw),
	net_worth_history: netWorthHistory,
	monthly_change: monthlyChange,
	monthly_change_pct: monthlyChangePct,
	cash,
	investments,
	debt,
	monthly_spending: currentMonthSpending.total,
	monthly_spending_trend_pct: round2(spendingTrendPct),
	top_goals: goalsDto.slice(0, 3),
	recent_transactions: recentTransactionsDto,
	allocation: portfolioDto.allocation,
	insight: dashboardInsight
};

export { monthlySpendingDto, portfolioDto, goalsDto };
