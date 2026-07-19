/**
 * Formatting helpers — single source of truth for currency, number and date
 * presentation. All use the pt-PT locale and EUR by default.
 */

import type { CurrencyCode } from '$lib/types/domain';

const currencyFormatters = new Map<string, Intl.NumberFormat>();

function currencyFormatter(currency: CurrencyCode): Intl.NumberFormat {
	const key = currency;
	let fmt = currencyFormatters.get(key);
	if (!fmt) {
		fmt = new Intl.NumberFormat('pt-PT', {
			style: 'currency',
			currency,
			maximumFractionDigits: 2
		});
		currencyFormatters.set(key, fmt);
	}
	return fmt;
}

const compactFormatter = new Intl.NumberFormat('pt-PT', {
	notation: 'compact',
	maximumFractionDigits: 1
});

const percentFormatter = new Intl.NumberFormat('pt-PT', {
	style: 'percent',
	minimumFractionDigits: 1,
	maximumFractionDigits: 1
});

const dateShort = new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short' });
const dateLong = new Intl.DateTimeFormat('pt-PT', {
	day: '2-digit',
	month: 'long',
	year: 'numeric'
});
const monthFormatter = new Intl.DateTimeFormat('pt-PT', { month: 'long', year: 'numeric' });

/** Full currency, e.g. "1 234,56 €". */
export function formatCurrency(value: number, currency: CurrencyCode = 'EUR'): string {
	return currencyFormatter(currency).format(value);
}

/** Compact currency for tight spaces, e.g. "12,3 mil €". */
export function formatCompactCurrency(value: number, currency: CurrencyCode = 'EUR'): string {
	const n = compactFormatter.format(value);
	return `${n} ${currency}`;
}

/** Signed currency, e.g. "+50,00 €" / "−12,30 €". */
export function formatSignedCurrency(value: number, currency: CurrencyCode = 'EUR'): string {
	const sign = value > 0 ? '+' : value < 0 ? '−' : '';
	return `${sign}${currencyFormatter(currency).format(Math.abs(value))}`;
}

/** Ratio (0.042) → "4,2%". */
export function formatPercent(ratio: number): string {
	return percentFormatter.format(ratio);
}

/** Already-in-percent number (4.2) → "+4,2%" / "−1,8%". */
export function formatPercentValue(value: number): string {
	const sign = value > 0 ? '+' : value < 0 ? '−' : '';
	return `${sign}${Math.abs(value).toLocaleString('pt-PT', { maximumFractionDigits: 1 })}%`;
}

export function formatNumber(value: number): string {
	return value.toLocaleString('pt-PT');
}

export function formatDate(iso: string, style: 'short' | 'long' = 'short'): string {
	const d = new Date(iso);
	return (style === 'long' ? dateLong : dateShort).format(d);
}

export function formatMonth(iso: string): string {
	return monthFormatter.format(new Date(iso));
}

/** "há 3 dias", "hoje", "ontem" — small relative helper. */
export function formatRelative(iso: string): string {
	const then = new Date(iso).getTime();
	const now = Date.now();
	const days = Math.round((now - then) / 86_400_000);
	if (days <= 0) return 'hoje';
	if (days === 1) return 'ontem';
	if (days < 7) return `há ${days} dias`;
	if (days < 30) return `há ${Math.round(days / 7)} sem`;
	return formatDate(iso);
}

export function trendDirection(value: number): 'up' | 'down' | 'flat' {
	return value > 0 ? 'up' : value < 0 ? 'down' : 'flat';
}
