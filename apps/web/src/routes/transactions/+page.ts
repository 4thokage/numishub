import type { PageLoad } from './$types';
import { getTransactions, getMonthlySpending, getInsight } from '$lib/api';

export const load: PageLoad = async () => {
	const [txns, spending, insight] = await Promise.all([
		getTransactions({ page: 1, pageSize: 20 }),
		getMonthlySpending(),
		getInsight('transactions')
	]);
	return { txns, spending, insight };
};
