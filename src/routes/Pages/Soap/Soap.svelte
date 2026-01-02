<script lang="ts">
	import SoapSell from "./SoapSell.svelte";
	import SoapProduction from "./SoapProduction.svelte";
	import { onMount } from "svelte";
	import { SoapPages } from "../../../Game/Content/Soap.svelte";
	import { PageHandler } from "../Pages";
	import { Pages } from "../../page.svelte";
	import SoapUpgrades from "./SoapUpgrades.svelte";

	const pageHandler = new PageHandler<SoapPages>(false, Pages.Soap);
	onMount(() => {
		let elements = document.getElementById("soap-pages")?.children!;
		pageHandler.RegisterPages(SoapPages.Sell, elements[0] as HTMLElement);
		pageHandler.RegisterPages(SoapPages.Produce, elements[1] as HTMLElement);
		pageHandler.RegisterPages(SoapPages.Upgrades, elements[2] as HTMLElement);

		pageHandler.ChangePage(SoapPages.Produce);
	});
</script>

<div class="absolute w-full">
	<div class=" flex flex-row w-full" id="soap-nav">
		<button onclick={() => pageHandler.ChangePage(SoapPages.Sell)}>
			Sell
		</button>
		<button onclick={() => pageHandler.ChangePage(SoapPages.Produce)}>
			Produce
		</button>
		<button onclick={() => pageHandler.ChangePage(SoapPages.Upgrades)}>
			Upgrades
		</button>
	</div>
	<div id="soap-pages" class="w-full h-screen overflow-y-scroll">
		<SoapSell />
		<SoapProduction />
		<SoapUpgrades />
	</div>
</div>

<style>
	#soap-nav > button {
		margin-left: 0.5rem;
	}

	#soap-pages {
		position: relative;
	}
</style>
