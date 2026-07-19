import type { PageLoad } from './$types';
import { getAccounts } from '$lib/api';

export const load: PageLoad = async () => {
	const accounts = await getAccounts();
	return { accounts };
};
