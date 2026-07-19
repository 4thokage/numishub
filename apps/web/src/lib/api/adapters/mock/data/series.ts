/** Deterministic pseudo-random generators so mocked charts are stable across builds. */

import type { TimePoint } from '$lib/types/domain';

export function mulberry32(seed: number): () => number {
	let s = seed >>> 0;
	return function () {
		s = (s + 0x6d2b79f5) | 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Monthly time series ending at `endDate`, drifting upward with mild noise. */
export function monthlySeries(
	count: number,
	startValue: number,
	drift: number,
	vol: number,
	seed: number,
	endDate = new Date()
): TimePoint[] {
	const rng = mulberry32(seed);
	const out: TimePoint[] = [];
	const cursor = new Date(endDate);
	cursor.setDate(1);
	cursor.setMonth(cursor.getMonth() - (count - 1));
	let v = startValue;
	for (let i = 0; i < count; i++) {
		const noise = (rng() - 0.5) * vol;
		v = Math.max(0, v + drift + noise);
		const date = new Date(cursor);
		out.push({ date: date.toISOString(), value: Math.round(v * 100) / 100 });
		cursor.setMonth(cursor.getMonth() + 1);
	}
	return out;
}

/** Daily time series ending today. */
export function dailySeries(
	count: number,
	startValue: number,
	drift: number,
	vol: number,
	seed: number,
	endDate = new Date()
): TimePoint[] {
	const rng = mulberry32(seed);
	const out: TimePoint[] = [];
	const cursor = new Date(endDate);
	cursor.setDate(cursor.getDate() - (count - 1));
	let v = startValue;
	for (let i = 0; i < count; i++) {
		const noise = (rng() - 0.5) * vol;
		v = Math.max(0, v + drift + noise);
		const date = new Date(cursor);
		out.push({ date: date.toISOString(), value: Math.round(v * 100) / 100 });
		cursor.setDate(cursor.getDate() + 1);
	}
	return out;
}

/** Round to 2 decimals. */
export const round2 = (n: number): number => Math.round(n * 100) / 100;
