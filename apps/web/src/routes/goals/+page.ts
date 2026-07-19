import type { PageLoad } from './$types';
import { getGoals, getInsight } from '$lib/api';

export const load: PageLoad = async () => {
	const [goals, insight] = await Promise.all([getGoals(), getInsight('goals')]);
	return { goals, insight };
};
