import type { PageLoad } from './$types';
import { getAccount } from '$lib/api';

export const load: PageLoad = async ({ params }) => {
	const account = await getAccount(params.id);
	return { account };
};
