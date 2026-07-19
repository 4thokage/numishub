<script lang="ts">
	import Icon from '../ui/Icon.svelte';
	import { toneSoftBg, toneText, type Tone } from '$lib/utils/tokens';
	import type { InsightTone } from '$lib/types/domain';

	interface Props {
		title: string;
		body: string;
		tone: InsightTone;
		icon: string;
	}

	let { title, body, tone, icon }: Props = $props();

	const accent = $derived<Tone>(
		tone === 'positive' ? 'gain' : tone === 'warning' ? 'warn' : 'brand'
	);
</script>

<div class="relative overflow-hidden panel p-5 transition-smooth hover:shadow-[var(--shadow-lift)]">
	<div
		class="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl {toneSoftBg(
			accent
		)}"
	></div>
	<div class="relative flex gap-4">
		<div
			class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl {toneSoftBg(
				accent
			)} {toneText(accent)}"
		>
			<Icon name={icon} size={22} />
		</div>
		<div class="min-w-0">
			<div class="flex items-center gap-2">
				<span class="text-xs font-semibold tracking-wide uppercase {toneText(accent)}"
					>Numis AI</span
				>
			</div>
			<h3 class="mt-0.5 text-base font-semibold text-surface-950-50">{title}</h3>
			<p class="mt-1 text-sm leading-relaxed text-surface-400-600">{body}</p>
		</div>
	</div>
</div>
