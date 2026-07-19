<script lang="ts">
	import type { Snippet } from 'svelte';
	import { toneSoftBg, toneSolidBg, toneText, type Tone } from '$lib/utils/tokens';

	interface Props {
		tone?: Tone;
		selected?: boolean;
		class?: string;
		children: Snippet;
		onclick?: () => void;
	}

	let {
		tone = 'surface',
		selected = false,
		class: klass = '',
		children,
		onclick
	}: Props = $props();
</script>

<button
	type="button"
	{onclick}
	class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-fast {selected
		? `${toneSolidBg(tone)} text-white`
		: `${toneSoftBg(tone)} ${toneText(tone)} hover:brightness-110`} {klass}"
>
	{@render children()}
</button>
