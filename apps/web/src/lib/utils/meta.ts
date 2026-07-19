import type { AccountType, AssetClass, GoalCategory, TransactionCategory } from '$lib/types/domain';

export interface Meta {
	label: string;
	icon: string;
	colorToken: string;
}

export const categoryMeta: Record<TransactionCategory, Meta> = {
	salary: { label: 'Salário', icon: 'banknote', colorToken: 'gain' },
	dividend: { label: 'Dividendos', icon: 'coins', colorToken: 'gain' },
	investment: { label: 'Investimento', icon: 'trending-up', colorToken: 'brand' },
	groceries: { label: 'Supermercado', icon: 'shopping-bag', colorToken: 'gain' },
	food: { label: 'Restauração', icon: 'utensils', colorToken: 'brand' },
	transport: { label: 'Transporte', icon: 'car', colorToken: 'warn' },
	shopping: { label: 'Compras', icon: 'shopping-bag', colorToken: 'loss' },
	entertainment: { label: 'Lazer', icon: 'star', colorToken: 'brand' },
	health: { label: 'Saúde', icon: 'heart-pulse', colorToken: 'loss' },
	housing: { label: 'Habitação', icon: 'home', colorToken: 'warn' },
	utilities: { label: 'Serviços', icon: 'zap', colorToken: 'warn' },
	travel: { label: 'Viagens', icon: 'plane', colorToken: 'brand' },
	other: { label: 'Outros', icon: 'tag', colorToken: 'surface' }
};

export const accountTypeMeta: Record<AccountType, Meta> = {
	checking: { label: 'Conta à ordem', icon: 'wallet', colorToken: 'brand' },
	savings: { label: 'Poupança', icon: 'piggy-bank', colorToken: 'warn' },
	investment: { label: 'Investimento', icon: 'trending-up', colorToken: 'gain' },
	crypto: { label: 'Crypto', icon: 'bitcoin', colorToken: 'warn' },
	credit: { label: 'Crédito', icon: 'credit-card', colorToken: 'loss' }
};

export const goalCategoryMeta: Record<GoalCategory, Meta> = {
	emergency: { label: 'Emergência', icon: 'shield', colorToken: 'gain' },
	travel: { label: 'Viagem', icon: 'plane', colorToken: 'brand' },
	home: { label: 'Casa', icon: 'home', colorToken: 'brand' },
	education: { label: 'Educação', icon: 'graduation', colorToken: 'warn' },
	vehicle: { label: 'Veículo', icon: 'car', colorToken: 'warn' },
	retirement: { label: 'Reforma', icon: 'piggy-bank', colorToken: 'gain' },
	other: { label: 'Outro', icon: 'target', colorToken: 'brand' }
};

export const assetClassMeta: Record<AssetClass, Meta> = {
	etf: { label: 'ETF', icon: 'trending-up', colorToken: 'brand' },
	stock: { label: 'Ação', icon: 'line-chart', colorToken: 'gain' },
	crypto: { label: 'Crypto', icon: 'bitcoin', colorToken: 'warn' },
	cash: { label: 'Dinheiro', icon: 'wallet', colorToken: 'surface' }
};

export const statusMeta: Record<string, { label: string; tone: string }> = {
	connected: { label: 'Ligado', tone: 'gain' },
	syncing: { label: 'A sincronizar', tone: 'warn' },
	error: { label: 'Erro', tone: 'loss' },
	disconnected: { label: 'Desligado', tone: 'surface' }
};
