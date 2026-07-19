/**
 * Maps design tokens to literal Tailwind class strings. We never build class
 * names dynamically (e.g. `bg-${token}`) because Tailwind's scanner would
 * purge them — every returned string is a full literal.
 */

export type Tone = 'brand' | 'gain' | 'loss' | 'warn' | 'surface';

const textByTone: Record<Tone, string> = {
	brand: 'text-brand-400',
	gain: 'text-gain-400',
	loss: 'text-loss-400',
	warn: 'text-warn-400',
	surface: 'text-surface-400-600'
};

const textStrongByTone: Record<Tone, string> = {
	brand: 'text-brand-300',
	gain: 'text-gain-300',
	loss: 'text-loss-300',
	warn: 'text-warn-300',
	surface: 'text-surface-300-700'
};

const softBgByTone: Record<Tone, string> = {
	brand: 'bg-brand-500/10',
	gain: 'bg-gain-500/10',
	loss: 'bg-loss-500/10',
	warn: 'bg-warn-500/15',
	surface: 'bg-surface-400-600/10'
};

const solidBgByTone: Record<Tone, string> = {
	brand: 'bg-brand-500',
	gain: 'bg-gain-500',
	loss: 'bg-loss-500',
	warn: 'bg-warn-500',
	surface: 'bg-surface-400-600'
};

const borderByTone: Record<Tone, string> = {
	brand: 'border-brand-500/30',
	gain: 'border-gain-500/30',
	loss: 'border-loss-500/30',
	warn: 'border-warn-500/30',
	surface: 'border-surface-300-700/30'
};

export const toneText = (t: Tone): string => textByTone[t];
export const toneTextStrong = (t: Tone): string => textStrongByTone[t];
export const toneSoftBg = (t: Tone): string => softBgByTone[t];
export const toneSolidBg = (t: Tone): string => solidBgByTone[t];
export const toneBorder = (t: Tone): string => borderByTone[t];

/** Solid color dot for legends (literal class for the scanner). */
const dotByTone: Record<Tone, string> = {
	brand: 'bg-brand-500',
	gain: 'bg-gain-500',
	loss: 'bg-loss-500',
	warn: 'bg-warn-500',
	surface: 'bg-surface-400-600'
};

export const toneDot = (t: Tone): string => dotByTone[t];

/** Infer a tone from a signed percentage (up = good by default). */
export function toneFromChange(pct: number, positiveIsGood = true): Tone {
	if (Math.abs(pct) < 0.05) return 'surface';
	const good = pct > 0 ? positiveIsGood : !positiveIsGood;
	return good ? 'gain' : 'loss';
}
