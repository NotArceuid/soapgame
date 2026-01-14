<script>
	import { DevHacks } from "../../../Game/Game.svelte.ts";
	import { Decimal } from "../../../Game/Shared/BreakInfinity/Decimal.svelte.ts";
	import { SoapType } from "../../../Game/Soap/Soap.svelte.ts";
	import {
		UpgradesData,
		UpgradesKey,
	} from "../../../Game/Soap/Upgrades.svelte.ts";
	import SoapProducer from "./SoapProducer.svelte";
	import { SoapProducers } from "./SoapProducer.svelte.ts";
</script>

<div class="absolute pl-2 pt-4 w-full overflow-y-scroll">
	<div class="flex flex-wrap w-full lg:space-x-2 md:space-x-6 space-y-6 ">
		<SoapProducer
      unlocked={true}
			type={SoapType.Red}
			canAutoSell={UpgradesData[UpgradesKey.RedSoapAutoSeller].count > 0}
			autoSellInterval={30 -
				3 * UpgradesData[UpgradesKey.RedSoapAutoSeller].count}
			autoSellReduction={UpgradesData[UpgradesKey.RedAutoSellReduction].count}
			autoSellBonus={UpgradesData[UpgradesKey.RedSoapAutoSellBonus].count}
			canAutobuyQuality={UpgradesData[UpgradesKey.RedQualityAutobuy].count > 0}
			canAutobuySpeed={UpgradesData[UpgradesKey.RedSpeedAutobuy].count > 0}
			canAutoDeccelerate={false}
			canDeccelerate={SoapProducers[SoapType.Red].Speed.gt(30)}
			canEat={UpgradesData[UpgradesKey.EatRedSoapUpgrade].count > 0}
			autoEatInterval={0}
			canAutoEat={false}
			autoEatBonus={new Decimal(1)}
		/>

		{#if DevHacks.skipUnlock}
			<SoapProducer
        unlocked={UpgradesData[UpgradesKey.UnlockOrangeSoap].count > 0}
				type={SoapType.Orange}
				canAutoSell={UpgradesData[UpgradesKey.OrangeSoapAutoSeller].count > 0}
				autoSellInterval={30 -
					3 * UpgradesData[UpgradesKey.OrangeSoapAutoSeller].count}
				autoSellReduction={UpgradesData[UpgradesKey.OrangeAutoSellReduction]
					.count}
				autoSellBonus={UpgradesData[UpgradesKey.OrangeSoapAutoSellBonus].count}
				canAutobuyQuality={UpgradesData[UpgradesKey.OrangeQualityAutoBuy].count > 0}
				canAutobuySpeed={UpgradesData[UpgradesKey.OrangeSpeedAutoBuy].count > 0}
				canAutoDeccelerate={false}
				canDeccelerate={SoapProducers[SoapType.Orange].Speed.gt(100)}
				canEat={false}
				autoEatInterval={0}
				canAutoEat={false}
				autoEatBonus={new Decimal(1)}
			/>
		{/if}

		{#if DevHacks.skipUnlock}
			<SoapProducer
        unlocked={UpgradesData[UpgradesKey.UnlockOrangeSoap].count > 0}
				type={SoapType.Orange}
				canAutoSell={UpgradesData[UpgradesKey.OrangeSoapAutoSeller].count > 0}
				autoSellInterval={30 -
					3 * UpgradesData[UpgradesKey.OrangeSoapAutoSeller].count}
				autoSellReduction={UpgradesData[UpgradesKey.OrangeAutoSellReduction]
					.count}
				autoSellBonus={UpgradesData[UpgradesKey.OrangeSoapAutoSellBonus].count}
				canAutobuyQuality={UpgradesData[UpgradesKey.OrangeQualityAutoBuy].count > 0}
				canAutobuySpeed={UpgradesData[UpgradesKey.OrangeSpeedAutoBuy].count > 0}
				canAutoDeccelerate={false}
				canDeccelerate={SoapProducers[SoapType.Orange].Speed.gt(100)}
				canEat={false}
				autoEatInterval={0}
				canAutoEat={false}
				autoEatBonus={new Decimal(1)}
			/>
		{/if}
	</div>
</div>
