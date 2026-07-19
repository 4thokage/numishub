<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import { formatCurrency, formatMonth } from '$lib/utils/format';
	import { goalCategoryMeta } from '$lib/utils/meta';
	import { toneSoftBg, toneText, toneSolidBg, type Tone } from '$lib/utils/tokens';
	import type { GoalProgressUi } from '$lib/types/ui';

	interface Props {
		goal: GoalProgressUi;
	}

	let { goal }: Props = $props();

	const meta = $derived(
		goalCategoryMeta[goal.category as keyof typeof goalCategoryMeta] ?? {
			label: goal.category,
			icon: goal.icon,
			colorToken: goal.colorToken
		}
	);
	const tone = $derived(goal.colorToken as Tone);
	const pct = $derived(Math.min(goal.pct, 100));
</script>

<div class="flex flex-col gap-4 panel p-5 transition-smooth hover:shadow-[var(--shadow-lift)]">
	<div class="flex items-start justify-between gap-3">
		<div class="flex min-w-0 items-center gap-3">
			<div
				class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl {toneSoftBg(
					tone
				)} {toneText(tone)}"
			>
				<Icon name={meta.icon} size={20} />
			</div>
			<div class="min-w-0">
				<h3 class="truncate font-semibold text-surface-950-50">{goal.name}</h3>
				<p class="text-xs text-surface-400-600">{meta.label}</p>
			</div>
		</div>
		<span class="shrink-0 text-sm font-semibold {toneText(tone)}">{Math.round(goal.pct)}%</span>
	</div>

	<div class="h-2 w-full overflow-hidden rounded-full bg-surface-400-600/15">
		<div
			class="h-full rounded-full {toneSolidBg(tone)} transition-[width] duration-500"
			style:width="{pct}%"
		></div>
	</div>

	<div class="flex items-end justify-between gap-2">
		<div>
			<p class="text-sm font-semibold text-surface-950-50">
				{formatCurrency(goal.current, goal.currency)}
			</p>
			<p class="text-xs text-surface-400-600">
				de {formatCurrency(goal.target, goal.currency)}
			</p>
		</div>
		<div class="text-right">
			<p class="text-xs text-surface-400-600">Projeção</p>
			<p class="text-sm font-medium {goal.onTrack ? toneText('gain') : toneText('warn')}">
				{formatMonth(goal.projectedDate)}
			</p>
		</div>
	</div>
</div>
