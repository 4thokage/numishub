import type { InsightDto } from '$lib/types/dto';

export const dashboardInsight: InsightDto = {
	id: 'ins-dashboard',
	title: 'Resumo de junho',
	body: 'Investiste 500 € este mês, gastaste 12% menos em restaurantes e deves atingir o teu fundo de emergência em outubro.',
	tone: 'positive',
	icon: 'sparkles'
};

export const transactionsInsight: InsightDto = {
	id: 'ins-transactions',
	title: 'Explicação de gastos',
	body: 'Os teus gastos em "Compras" aumentaram 8% face ao mês passado, sobretudo na Zara e Amazon. Considera um limite mensal.',
	tone: 'warning',
	icon: 'trending-up'
};

export const investmentsInsight: InsightDto = {
	id: 'ins-investments',
	title: 'Resumo do portfólio',
	body: 'O teu portfólio valorizou 4,2% este mês, impulsionado por NVDA (+2,1% hoje). Estás 62% em ETFs — boa diversificação.',
	tone: 'positive',
	icon: 'line-chart'
};

export const goalsInsight: InsightDto = {
	id: 'ins-goals',
	title: 'Projeção de objetivos',
	body: 'Ao ritmo atual de 600 €/mês, atinges a Entrada de Casa 3 meses antes do prazo. Estás no bom caminho!',
	tone: 'positive',
	icon: 'target'
};
