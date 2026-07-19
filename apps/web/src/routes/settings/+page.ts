import type { PageLoad } from './$types';
import { getSettings } from '$lib/api';

export const load: PageLoad = async () => {
	const settings = await getSettings();
	return { settings };
};
