import type { PageLoad } from './$types';
import { getDashboard, getMonthlySpending } from '$lib/api';

export const load: PageLoad = async () => {
	const [dashboard, spending] = await Promise.all([getDashboard(), getMonthlySpending()]);
	return { dashboard, spending };
};
