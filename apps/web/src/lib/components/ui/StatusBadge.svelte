<script lang="ts">
	import { statusMeta } from '$lib/utils/meta';
	import { toneSoftBg, toneText, type Tone } from '$lib/utils/tokens';

	interface Props {
		status: string;
	}

	let { status }: Props = $props();

	const meta = $derived(statusMeta[status] ?? { label: status, tone: 'surface' });
	const tone = $derived(meta.tone as Tone);
</script>

<span
	class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium {toneSoftBg(
		tone
	)} {toneText(tone)}"
>
	<span class="h-1.5 w-1.5 rounded-full {toneText(tone)} bg-current"></span>
	{meta.label}
</span>
