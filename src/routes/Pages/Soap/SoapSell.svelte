<script lang="ts">
	import { Player } from "../../../Game/Player.svelte";
	import SoapSellCard from "./SoapSellCard.svelte";
</script>

<div class="absolute w-full h-full">
	<div class="flex flex-wrap">
		{#each Player.Soap as soap}
			{#if soap[1].Unlocked}
				<SoapSellCard soap={soap[1]} />
			{/if}
		{/each}
	</div>
</div>
