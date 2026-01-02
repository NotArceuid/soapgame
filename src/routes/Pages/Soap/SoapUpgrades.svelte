<script lang="ts">
	import { log } from "console";
	import { Bulk, Player } from "../../../Game/Player.svelte";
	import {
		UpgradesData,
		UpgradesKey,
		type IUpgrades,
	} from "../../../Game/Soap/Upgrades.svelte";

	let currUpgrade = $state<[UpgradesKey, IUpgrades]>();
	let count = $derived(Player.SoapUpgrades.get(currUpgrade?.[0] ?? 0));
	function hoverUpgrade(upgrade: [UpgradesKey, IUpgrades]) {
		currUpgrade = upgrade;
	}

	let canBuy = $derived(
		currUpgrade?.[1]?.Requirements?.every((t) => t[1]()) ? "" : "bg-gray-200",
	);

	let amount = $state(1);
	$effect(() => {
		if (!currUpgrade) return;
		switch (Player.Bulk) {
			case Bulk.One:
				amount = 1;
				break;
			case Bulk.Ten:
				amount = 10;
				break;
			case Bulk.TwoFive:
				amount = 25;
				break;
			case Bulk.Juanzerozeo:
				amount = 100;
				break;
			case Bulk.Max:
				if (currUpgrade[1].getMax) amount = currUpgrade[1].getMax();
				break;
		}

		currUpgrade[1].buyAmount = amount;
	});

	function buyUpgrades(upgrade: IUpgrades) {}
</script>

<div class="absolute m-2 w-full flex flex-col h-8/12">
	<h1 class="">The tab where i bully you with upgrades >:)</h1>
	<div class="flex flex-wrap overflow-scroll">
		{#each UpgradesData as upgrade}
			<button
				class="{currUpgrade?.[0] == upgrade[0] ? 'bg-gray-200' : ''} "
				onclick={() => hoverUpgrade(upgrade)}
				>{upgrade[1].name} ({!count ? 0 : count}/{upgrade[1].maxCount})</button
			>
		{/each}
	</div>
	<!-- Bottom frag -->
	<div class="mt-auto pt-4 flex flex-col items-center content-center">
		{#if currUpgrade}
			<h1>
				{currUpgrade[1].name}
				({!count ? 0 : count}/{currUpgrade[1].maxCount})
			</h1>
			<h1 class="mb-2">{currUpgrade[1].description()}</h1>
			<button class={canBuy}>
				<div>
					{#each currUpgrade[1].Requirements as requirements}
						<div>{requirements[0]()}</div>
					{/each}
				</div>
			</button>
		{/if}
	</div>
</div>
