import type { ApiAdapter } from './types';
import { MockAdapter } from './adapters/mock';
import { HttpAdapter } from './adapters/http';

const mode = (import.meta.env.PUBLIC_API_MODE ?? 'mock').toLowerCase();

let instance: ApiAdapter | null = null;

/** Returns the active transport adapter (mock by default, http when configured). */
export function getAdapter(): ApiAdapter {
	if (!instance) {
		instance = mode === 'http' ? new HttpAdapter() : new MockAdapter();
	}
	return instance;
}
