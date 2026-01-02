<script lang="ts">
	import { type IProgress } from "../../Game/Action.svelte";
	import { formatter } from "../../Game/Shared/BreakInfinity/Formatter.ts";
	import { ColorTheme } from "../../routes/Pages/Settings.svelte.ts";
	import type { ProgressBarOptions } from "./Progressbar.svelte.ts";

	let {
		data,
		ops,
		onClick,
		textOverride,
	}: {
		data: IProgress;
		ops?: ProgressBarOptions;
		onClick?: () => void;
		textOverride?: string;
	} = $props();

	let amount = $state();
	let isConstant = $state(false);
	let opsData: ProgressBarOptions = $derived({
		barBackgroundClass: ops?.barBackgroundClass || "",
		wrapperClass: ops?.wrapperClass || "w-full",
		barProgressClass: ops?.barProgressClass || "bg-blue-300",
		height: ops?.height ?? 20,
	});

	$effect(() => {
		if (data.valueGain?.gt(data.valueGain)) {
			isConstant = true;
			amount = 100;
		} else {
			isConstant = false;
			amount = data.value.div(data.maxValue).toNumber() * 100;
		}
	});
</script>

<button
	onclick={() => onClick?.()}
	class="flex relative {opsData?.wrapperClass}"
	style="height: {opsData.height}px"
>
	<span class="inset-0 font-semibold flex items-center z-1">
		<span class="text-sm px-2">
			{#if textOverride}
				{textOverride}
			{:else if opsData.height! >= 20}
				{#if isConstant}
					{formatter.format(data.value)} / {formatter.format(data.valueGain)} (Constant)
				{:else}
					{formatter.format(data.value)} / {formatter.format(data.maxValue)}
				{/if}
			{/if}
		</span>
	</span>

	<span
		class="absolute {opsData.barProgressClass} h-full rounded-4xl"
		style="width: {amount}%"
	></span>

	<span
		class="w-full h-full absolute {opsData.barBackgroundClass} rounded-4xl"
		style="border: 1px solid  rgba({ColorTheme.BorderColor.r}, {ColorTheme
			.BorderColor.g}, {ColorTheme.BorderColor.b}, {ColorTheme.BorderColor.a});"
	></span>
</button>
