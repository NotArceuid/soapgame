<script lang="ts">
	import { GeneratorsData } from "../../../Game/Foundry/Generator.svelte";
	import ActionButton from "../../Components/ActionButton.svelte";
	import UpgradesInfo from "../../Components/UpgradesInfo.svelte";
	import type { IUpgradesInfo } from "../../Components/UpgradesInfo.svelte.ts";
	import Milestones from "./Milestones.svelte";

	let currUpgrade: IUpgradesInfo | undefined = $state();
	let canBuy = $derived(
		currUpgrade?.Requirements?.every((t) => t()) ? "" : "bg-gray-100",
	);

	function hoverUpgrade(upgrade: IUpgradesInfo) {
		currUpgrade = upgrade;
	}
</script>

<div class="h-full absolute w-full flex flex-row p-2 overflow-y-scroll">
	<div class="w-4/6 mr-4 flex flex-col">
		<div class=" border mb-2">
			<h1 class="font-bold border-b p-2">Generator</h1>
			<div class="m-1 space-x-2">
				{#each Object.values(GeneratorsData) as generator}
					<ActionButton
						disabled={!generator.Requirements}
						onclick={() => {
							currUpgrade = generator;
						}}
					>
						{#snippet content()}
							<span>{generator.name}</span>
						{/snippet}
					</ActionButton>
				{/each}
			</div>
		</div>

		<div class="h-36 border mt-auto flex flex-col justify-center items-center">
			<div>
				<UpgradesInfo upgrade={currUpgrade} />
			</div>
		</div>
	</div>

	<div class="w-2/6 border">
		<Milestones />
	</div>
</div>
