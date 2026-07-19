import type { ProviderDto, SettingsDto } from '$lib/types/dto';

export const providersDto: ProviderDto[] = [
	{
		id: 'prov-activo',
		name: 'ActivoBank',
		status: 'connected',
		accounts_count: 2,
		last_synced_at: new Date(Date.now() - 1000 * 60 * 12).toISOString()
	},
	{
		id: 'prov-tr',
		name: 'Trade Republic',
		status: 'connected',
		accounts_count: 1,
		last_synced_at: new Date(Date.now() - 1000 * 60 * 34).toISOString()
	},
	{
		id: 'prov-revolut',
		name: 'Revolut',
		status: 'syncing',
		accounts_count: 2,
		last_synced_at: new Date(Date.now() - 1000 * 60 * 3).toISOString()
	}
];

export const settingsDto: SettingsDto = {
	profile: { name: 'João Silva', email: 'joao.silva@email.com', avatar_initials: 'JS' },
	appearance: { theme: 'dark', density: 'comfortable' },
	notifications: { insights: true, large_transactions: true, goal_milestones: true, weekly: false },
	currency: 'EUR',
	export: { format: 'csv', auto: false },
	security: { two_factor: true, biometrics: true, pin_lock: false }
};
