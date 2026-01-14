<script lang="ts">
	import { DevHacks, MainLoop } from "../Game/Game.svelte.ts";
	import { dev } from "$app/environment";
	import Settings from "./Pages/Settings.svelte";
	import Soap from "./Pages/Soap/Soap.svelte";
	import Howtfdoiplay from "./Pages/guide/howtfdoiplay.svelte";
	import Cat from "./Pages/Cat/Cat.svelte";
	import Achievements from "./Pages/Achievements/Achievements.svelte";
	import CurrenciesPanel from "./Components/CurrenciesPanel.svelte";
	import NotificationHandler from "./Components/NotificationHandler.svelte";
	import NavBar from "./Components/NavBar.svelte";
	import { isLoading } from "svelte-i18n";
	import { MainPageHandler, PagesEnum } from "./Pages/Pages.svelte.ts";

	MainLoop.start();

	isLoading.subscribe((state) => {
		if (state) return;
		let elements = document.getElementById("locations")?.children!;
		MainPageHandler.RegisterPages(PagesEnum.Soap, elements[0] as HTMLElement);
		MainPageHandler.RegisterPages(PagesEnum.Cat, elements[1] as HTMLElement);
		MainPageHandler.RegisterPages(
			PagesEnum.Achievements,
			elements[2] as HTMLElement,
		);
		MainPageHandler.RegisterPages(
			PagesEnum.Settings,
			elements[3] as HTMLElement,
		);
		MainPageHandler.RegisterPages(
			PagesEnum.HowTfDoIPlay,
			elements[4] as HTMLElement,
		);

		MainPageHandler.ChangePage(PagesEnum.Soap);
	});
</script>

{#if isLoading}
	<div class="h-full relative m-3 p-3 flex flex-col">
		<NavBar />
		<div class="flex flex-rows w-full h-full">
			<div id="locations" class="w-11/12 relative border-l">
				<Soap />
				<Cat />
				<Achievements />
				<Settings />
				<Howtfdoiplay />
			</div>
      <div class="min-w-42">
			<CurrenciesPanel />
      </div>
		</div>

		<div class="absolute bottom-5 right-5">
			<NotificationHandler />
		</div>
		<div class="bottom-5 left-5 border-t p-2">
			<div class="pt-auto flex flex-col gap-2">
				<div class="flex items-center gap-6">
					<a
						href="mailto:jschong08@protonmail.com"
						class="flex items-center gap-2"
					>
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
							/>
						</svg>
						<span>Email</span>
					</a>

					<a
						href="https://github.com/notarceuid"
						class="flex items-center gap-2"
					>
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
							/>
						</svg>
						<span>Github</span>
					</a>

					<a
						href="https://discord.gg/AvzwHzCH7C"
						class="flex items-center gap-2"
					>
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515a.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0a12.64 12.64 0 00-.617-1.25a.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057a19.9 19.9 0 005.993 3.03a.078.078 0 00.084-.028a14.09 14.09 0 001.226-1.994a.076.076 0 00-.041-.106a13.107 13.107 0 01-1.872-.892a.077.077 0 01-.008-.128a10.2 10.2 0 00.372-.292a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127a12.299 12.299 0 01-1.873.892a.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028a19.839 19.839 0 006.002-3.03a.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
							/>
						</svg>
						<span>Discord</span>
					</a>
					<a
						href="https://ko-fi.com/Y8Y21S39ZS"
						class="flex flex-row items-center gap-2"
					>
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
							/>
						</svg>
						<span>Support me</span>
					</a>
				</div>
			</div>
		</div>
	</div>
	{#if dev}
		<div class="absolute -top-1">
			<input
				type="checkbox"
				bind:checked={DevHacks.speedhack}
				onchange={() => {
					MainLoop.restart();
				}}
			/>
			<input type="checkbox" bind:checked={DevHacks.skipUnlock} />
		</div>
	{/if}
{:else}
	<div class="flex items-center justify-center min-h-screen">
		<div class="text-center">
			<h1>Loading..</h1>
		</div>
	</div>
{/if}
