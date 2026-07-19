import type { PageLoad } from './$types';
import { getHolding, getInsight } from '$lib/api';

export const load: PageLoad = async ({ params }) => {
	const [holding, insight] = await Promise.all([getHolding(params.id), getInsight('investments')]);
	return { holding, insight };
};
