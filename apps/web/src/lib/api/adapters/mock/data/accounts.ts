import type { AccountDto } from '$lib/types/dto';
import { dailySeries, monthlySeries, round2 } from './series';

const now = new Date();

export const accountsDto: AccountDto[] = [
	{
		id: 'acc-activo-checking',
		name: 'Conta Ordenado',
		institution: 'ActivoBank',
		type: 'checking',
		balance: 3240.5,
		currency: 'EUR',
		status: 'connected',
		last_synced_at: new Date(now.getTime() - 1000 * 60 * 12).toISOString(),
		mask: '****4821',
		color_token: 'brand',
		history: monthlySeries(12, 2100, 95, 240, 11)
	},
	{
		id: 'acc-tr-portfolio',
		name: 'Portfolio TR',
		institution: 'Trade Republic',
		type: 'investment',
		balance: 25956.7,
		currency: 'EUR',
		status: 'connected',
		last_synced_at: new Date(now.getTime() - 1000 * 60 * 34).toISOString(),
		mask: '****9930',
		color_token: 'gain',
		history: monthlySeries(12, 19800, 540, 900, 22)
	},
	{
		id: 'acc-revolut-vault',
		name: 'Vault',
		institution: 'Revolut',
		type: 'savings',
		balance: 5400.0,
		currency: 'EUR',
		status: 'connected',
		last_synced_at: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(),
		mask: '****1175',
		color_token: 'warn',
		history: monthlySeries(12, 3200, 180, 160, 33)
	},
	{
		id: 'acc-revolut-crypto',
		name: 'Crypto',
		institution: 'Revolut',
		type: 'crypto',
		balance: 1836.0,
		currency: 'EUR',
		status: 'syncing',
		last_synced_at: new Date(now.getTime() - 1000 * 60 * 3).toISOString(),
		mask: '****1175',
		color_token: 'warn',
		history: dailySeries(30, 1980, 12, 90, 44)
	},
	{
		id: 'acc-activo-credit',
		name: 'Cartão Crédito',
		institution: 'ActivoBank',
		type: 'credit',
		balance: -850.25,
		currency: 'EUR',
		status: 'error',
		last_synced_at: new Date(now.getTime() - 1000 * 60 * 60 * 26).toISOString(),
		mask: '****9043',
		color_token: 'loss',
		history: monthlySeries(12, -620, -20, 120, 55)
	}
];

export const totalCash = round2(
	accountsDto
		.filter((a) => a.type === 'checking' || a.type === 'savings')
		.reduce((s, a) => s + a.balance, 0)
);

export const totalInvestments = round2(
	accountsDto.filter((a) => a.type === 'investment').reduce((s, a) => s + a.balance, 0)
);

export const totalCrypto = round2(
	accountsDto.filter((a) => a.type === 'crypto').reduce((s, a) => s + a.balance, 0)
);

export const totalDebt = round2(
	accountsDto.filter((a) => a.type === 'credit').reduce((s, a) => s + a.balance, 0)
);

export const netWorth = round2(totalCash + totalInvestments + totalCrypto + totalDebt);
