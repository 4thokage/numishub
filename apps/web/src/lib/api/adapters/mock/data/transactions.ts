import type { TransactionDto } from '$lib/types/dto';
import type { TransactionCategory } from '$lib/types/domain';
import { accountsDto } from './accounts';
import { mulberry32, round2 } from './series';

const accountName = (id: string): string => accountsDto.find((a) => a.id === id)?.name ?? 'Conta';

interface Template {
	merchant: string;
	description: string;
	category: TransactionCategory;
	min: number;
	max: number;
	income: boolean;
	accountId: string;
	recurring?: boolean;
	receipt?: boolean;
	notes?: string;
}

const templates: Template[] = [
	{
		merchant: 'Empresa — Ordenado',
		description: 'Salário mensal',
		category: 'salary',
		min: 2480,
		max: 2520,
		income: true,
		accountId: 'acc-activo-checking',
		recurring: true,
		notes: 'Salário líquido'
	},
	{
		merchant: 'Trade Republic',
		description: 'Dividendos VWCE',
		category: 'dividend',
		min: 12,
		max: 48,
		income: true,
		accountId: 'acc-tr-portfolio'
	},
	{
		merchant: 'Trade Republic',
		description: 'Reforço mensal',
		category: 'investment',
		min: 300,
		max: 600,
		income: false,
		accountId: 'acc-activo-checking',
		recurring: true,
		notes: 'Investimento automático'
	},
	{
		merchant: 'Mercadona',
		description: 'Supermercado',
		category: 'groceries',
		min: 22,
		max: 78,
		income: false,
		accountId: 'acc-activo-checking',
		receipt: true
	},
	{
		merchant: 'Lidl',
		description: 'Supermercado',
		category: 'groceries',
		min: 14,
		max: 52,
		income: false,
		accountId: 'acc-activo-checking',
		receipt: true
	},
	{
		merchant: 'Pingo Doce',
		description: 'Supermercado',
		category: 'groceries',
		min: 18,
		max: 64,
		income: false,
		accountId: 'acc-activo-checking'
	},
	{
		merchant: 'Continente',
		description: 'Supermercado',
		category: 'groceries',
		min: 20,
		max: 70,
		income: false,
		accountId: 'acc-activo-checking'
	},
	{
		merchant: 'Uber',
		description: 'Transporte',
		category: 'transport',
		min: 4,
		max: 18,
		income: false,
		accountId: 'acc-activo-checking'
	},
	{
		merchant: 'CP — Comboios',
		description: 'Passe mensal',
		category: 'transport',
		min: 30,
		max: 40,
		income: false,
		accountId: 'acc-activo-checking',
		recurring: true,
		receipt: true
	},
	{
		merchant: 'Spotify',
		description: 'Subscrição Premium',
		category: 'entertainment',
		min: 10.99,
		max: 10.99,
		income: false,
		accountId: 'acc-activo-checking',
		recurring: true,
		receipt: true
	},
	{
		merchant: 'Netflix',
		description: 'Subscrição Standard',
		category: 'entertainment',
		min: 12.99,
		max: 12.99,
		income: false,
		accountId: 'acc-activo-checking',
		recurring: true,
		receipt: true
	},
	{
		merchant: 'Steam',
		description: 'Jogo',
		category: 'entertainment',
		min: 6,
		max: 60,
		income: false,
		accountId: 'acc-activo-checking'
	},
	{
		merchant: 'Amazon',
		description: 'Vários',
		category: 'shopping',
		min: 12,
		max: 140,
		income: false,
		accountId: 'acc-activo-checking',
		receipt: true
	},
	{
		merchant: 'Zara',
		description: 'Vestuário',
		category: 'shopping',
		min: 20,
		max: 95,
		income: false,
		accountId: 'acc-activo-credit'
	},
	{
		merchant: 'Decathlon',
		description: 'Desporto',
		category: 'shopping',
		min: 15,
		max: 80,
		income: false,
		accountId: 'acc-activo-credit'
	},
	{
		merchant: 'IKEA',
		description: 'Casa',
		category: 'shopping',
		min: 30,
		max: 220,
		income: false,
		accountId: 'acc-activo-credit'
	},
	{
		merchant: 'EDP',
		description: 'Eletricidade',
		category: 'utilities',
		min: 32,
		max: 62,
		income: false,
		accountId: 'acc-activo-checking',
		recurring: true,
		receipt: true
	},
	{
		merchant: 'Águas de Lisboa',
		description: 'Água',
		category: 'utilities',
		min: 12,
		max: 26,
		income: false,
		accountId: 'acc-activo-checking',
		recurring: true
	},
	{
		merchant: 'WOO',
		description: 'Telemóvel',
		category: 'utilities',
		min: 9.99,
		max: 19.99,
		income: false,
		accountId: 'acc-activo-checking',
		recurring: true
	},
	{
		merchant: 'NOS',
		description: 'TV + Net',
		category: 'utilities',
		min: 29.99,
		max: 29.99,
		income: false,
		accountId: 'acc-activo-credit',
		recurring: true
	},
	{
		merchant: 'Restaurante Tagide',
		description: 'Jantar',
		category: 'food',
		min: 12,
		max: 48,
		income: false,
		accountId: 'acc-activo-credit'
	},
	{
		merchant: 'Starbucks',
		description: 'Café',
		category: 'food',
		min: 3,
		max: 9,
		income: false,
		accountId: 'acc-activo-credit'
	},
	{
		merchant: 'Farmácia',
		description: 'Saúde',
		category: 'health',
		min: 4,
		max: 32,
		income: false,
		accountId: 'acc-activo-checking',
		receipt: true
	},
	{
		merchant: 'Gympass',
		description: 'Ginásio',
		category: 'health',
		min: 29.9,
		max: 29.9,
		income: false,
		accountId: 'acc-activo-checking',
		recurring: true
	},
	{
		merchant: 'Rendas — Senhorio',
		description: 'Renda',
		category: 'housing',
		min: 850,
		max: 850,
		income: false,
		accountId: 'acc-activo-credit',
		recurring: true,
		notes: 'Renda mensal'
	},
	{
		merchant: 'Revolut',
		description: 'Transferência poupança',
		category: 'other',
		min: 100,
		max: 300,
		income: false,
		accountId: 'acc-activo-checking',
		recurring: true
	},
	{
		merchant: 'TAP Air Portugal',
		description: 'Viagem',
		category: 'travel',
		min: 90,
		max: 380,
		income: false,
		accountId: 'acc-activo-credit',
		receipt: true
	},
	{
		merchant: 'Apple',
		description: 'App Store',
		category: 'shopping',
		min: 1,
		max: 30,
		income: false,
		accountId: 'acc-activo-credit'
	}
];

export function generateTransactions(count = 64, seed = 707): TransactionDto[] {
	const rng = mulberry32(seed);
	const out: TransactionDto[] = [];
	const cursor = new Date();
	let id = 0;
	// Weight recurring/essential transactions to appear more often.
	const pool: Template[] = [];
	for (const t of templates) {
		const weight = t.recurring ? 3 : 1;
		for (let i = 0; i < weight; i++) pool.push(t);
	}
	for (let i = 0; i < count; i++) {
		const t = pool[Math.floor(rng() * pool.length)];
		const amount = round2(t.min + rng() * (t.max - t.min)) * (t.income ? 1 : -1);
		cursor.setDate(cursor.getDate() - Math.floor(rng() * 2.4));
		const date = cursor.toISOString();
		out.push({
			id: `txn-${id++}`,
			date,
			merchant: t.merchant,
			description: t.description,
			amount,
			currency: 'EUR',
			category: t.category,
			account_id: t.accountId,
			account_name: accountName(t.accountId),
			notes: t.notes,
			is_recurring: !!t.recurring,
			pending: false,
			has_receipt: !!t.receipt
		});
	}
	return out.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export const transactionsDto: TransactionDto[] = generateTransactions();

export const recentTransactionsDto: TransactionDto[] = transactionsDto.slice(0, 8);
