import type { PageLoad } from './$types';
import { getPortfolio, getInvestments, getInsight } from '$lib/api';

export const load: PageLoad = async () => {
	const [portfolio, holdings, insight] = await Promise.all([
		getPortfolio(),
		getInvestments(),
		getInsight('investments')
	]);
	return { portfolio, holdings, insight };
};
