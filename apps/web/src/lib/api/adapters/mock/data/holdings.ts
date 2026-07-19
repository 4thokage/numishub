import type { HoldingDto } from '$lib/types/dto';
import { dailySeries } from './series';

export const holdingsDto: HoldingDto[] = [
	{
		id: 'hld-vwce',
		symbol: 'VWCE',
		name: 'Vanguard FTSE All-World',
		asset_class: 'etf',
		quantity: 100,
		avg_cost: 95.0,
		current_price: 112.5,
		currency: 'EUR',
		account_id: 'acc-tr-portfolio',
		day_change_pct: 0.8,
		history: dailySeries(30, 108.2, 0.14, 1.6, 101)
	},
	{
		id: 'hld-sxr8',
		symbol: 'SXR8',
		name: 'iShares Core S&P 500',
		asset_class: 'etf',
		quantity: 20,
		avg_cost: 410.0,
		current_price: 498.2,
		currency: 'EUR',
		account_id: 'acc-tr-portfolio',
		day_change_pct: 0.4,
		history: dailySeries(30, 486.0, 0.42, 4.2, 102)
	},
	{
		id: 'hld-iwda',
		symbol: 'IWDA',
		name: 'iShares MSCI World',
		asset_class: 'etf',
		quantity: 15,
		avg_cost: 88.0,
		current_price: 102.3,
		currency: 'EUR',
		account_id: 'acc-tr-portfolio',
		day_change_pct: 0.6,
		history: dailySeries(30, 98.4, 0.13, 1.1, 103)
	},
	{
		id: 'hld-nvda',
		symbol: 'NVDA',
		name: 'NVIDIA Corporation',
		asset_class: 'stock',
		quantity: 8,
		avg_cost: 95.0,
		current_price: 138.4,
		currency: 'EUR',
		account_id: 'acc-tr-portfolio',
		day_change_pct: 2.1,
		history: dailySeries(30, 121.0, 0.58, 3.8, 104)
	},
	{
		id: 'hld-aapl',
		symbol: 'AAPL',
		name: 'Apple Inc.',
		asset_class: 'stock',
		quantity: 10,
		avg_cost: 165.0,
		current_price: 210.1,
		currency: 'EUR',
		account_id: 'acc-tr-portfolio',
		day_change_pct: -0.5,
		history: dailySeries(30, 214.0, -0.12, 3.1, 105)
	},
	{
		id: 'hld-btc',
		symbol: 'BTC',
		name: 'Bitcoin',
		asset_class: 'crypto',
		quantity: 0.03,
		avg_cost: 38000.0,
		current_price: 61200.0,
		currency: 'EUR',
		account_id: 'acc-revolut-crypto',
		day_change_pct: 1.4,
		history: dailySeries(30, 56800, 150, 1400, 106)
	}
];
