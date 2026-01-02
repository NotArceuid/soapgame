<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import { getLocaleFromNavigator, init, waitLocale } from "svelte-i18n";
	import "../app.css";
	import { RegisterLocales } from "../Locales/i18n";
	import { InvertedTextColor, ColorTheme } from "./Pages/Settings.svelte.ts";
	let { children } = $props();

	RegisterLocales();
	init({
		initialLocale: getLocaleFromNavigator() || "en",
		fallbackLocale: "en",
	});

	waitLocale();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class="w-full h-full text-gray-900 transition-colors duration-300 {InvertedTextColor.val
		? 'text-gray-900'
		: 'text-white'}"
	style="background-color: rgba({ColorTheme.OverlayBg.r}, {ColorTheme.OverlayBg
		.g}, {ColorTheme.OverlayBg.b}, {ColorTheme.OverlayBg.a});"
>
	<main class="w-full h-full">
		{@render children?.()}
	</main>
</div>
