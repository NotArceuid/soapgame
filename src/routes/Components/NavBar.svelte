<script lang="ts">
	import { MainPageHandler, PagesEnum } from "../Pages/Pages.svelte";
</script>

<div id="navbar" class="border-x border-t p-3">
	<button onclick={() => MainPageHandler.ChangePage(PagesEnum.Soap)}
		>Soap</button
	>
	<button onclick={() => MainPageHandler.ChangePage(PagesEnum.Cat)}
		>Cat ₍^. .^₎⟆</button
	>
	<button onclick={() => MainPageHandler.ChangePage(PagesEnum.Achievements)}
		>Achievements</button
	>
	<button onclick={() => MainPageHandler.ChangePage(PagesEnum.Settings)}
		>Settings</button
	>
	<button
		class="justify-end"
		onclick={() => MainPageHandler.ChangePage(PagesEnum.HowTfDoIPlay)}
		>How Do I Play</button
	>
</div>

<style>
	#navbar {
		width: 100%;
		display: flex;
		border-bottom: 1px solid #000;
	}

	#navbar button {
		margin-left: 0.5rem;
	}
</style>
