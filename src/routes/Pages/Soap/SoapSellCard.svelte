<script lang="ts">
	import type { Soap } from "../../../Game/Soap/Soap.svelte";
	import { Bulk, Player } from "../../../Game/Player.svelte";
	import { Decimal } from "../../../Game/Shared/BreakInfinity/Decimal.svelte";

	let { soap }: { soap: Soap } = $props();
	let amount = $state(Decimal.ONE);
	function Sell() {
		if (soap.CanSell(amount)) {
			soap.Sell(amount);
		}
	}

	function Consume() {}

	$effect(() => {
		switch (Player.Bulk) {
			case Bulk.One:
				amount = Decimal.ONE;
				break;
			case Bulk.Ten:
				amount = new Decimal(10);
				break;
			case Bulk.TwoFive:
				amount = new Decimal(25);
				break;
			case Bulk.Juanzerozeo:
				amount = new Decimal(100);
				break;
			case Bulk.Max:
				amount = soap.Amount;
				break;
		}
	});
</script>

<div class="border m-2 p-2 min-w-3/12">
	<h1>{soap.Type}</h1>
	<h1>Amount: {soap.Amount}</h1>
	<div class="flex flex-row">
		<button class="w-full mr-1" onclick={Sell}>Sell {amount}x</button>
		<button class="w-full" onclick={Consume}>Eat {amount}x</button>
	</div>
</div>
