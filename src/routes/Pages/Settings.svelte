<script lang="ts">
	import { SaveSystem } from "../../Game/Saves.ts";
	import { onMount } from "svelte";
	import { _ } from "svelte-i18n";
	import { Player } from "../../Game/Player.svelte.ts";
	import { formatter, formatTime, Notation } from "../../Game/Shared/BreakInfinity/Formatter.svelte.ts";
	import SaveSlot from "./SaveSlot.svelte";
	import { ColorTheme, Settings } from "./Settings.svelte.ts";

	let saveStatus = $state("");
	async function SavePlayerData() {
		saveStatus = $_("settings.saves.saving");
		try {
			await SaveSystem.exportToString();
			saveStatus = $_("settings.saves.gamesaved");
		} catch {
			saveStatus = $_("settings.saves.savefailed");
		}
		setTimeout(() => (saveStatus = ""), 2000);
	}

	// No exception handling here, why? because i trust the LLM overlords!!
	async function saveToClipboard() {
		const saveString = await SaveSystem.exportToString();
		await navigator.clipboard.writeText(saveString);
		saveStatus = $_("settings.saves.savedtoclipboard");
		setTimeout(() => (saveStatus = ""), 2000);
	}

	async function saveToFile() {
		try {
			const saveString = await SaveSystem.exportToString();
			const blob = new Blob([saveString], { type: "text/plain" });
			const a = document.createElement("a");
			document.body.append(a);
			a.download = "game_save.txt";
			a.href = URL.createObjectURL(blob);
			a.click();
			a.remove();

			saveStatus = $_("settings.saves.gamesaved");
		} catch {
			saveStatus = $_("settings.saves.loadfailed");
		}
		setTimeout(() => (saveStatus = ""), 2000);
	}

	let autoSaveTimer: number | null = null;
	let lastAutoSave = $state<Date | null>(null);

	function startAutoSave() {
		if (autoSaveTimer) {
			clearInterval(autoSaveTimer);
		}
		autoSaveTimer = window.setInterval(async () => {
			try {
				SavePlayerData();
				lastAutoSave = new Date();
			} catch (error) {
				console.warn($_("settings.saves.savefailed"), error);
			}
		}, 30000);
	}

	async function saveOnUnload() {
		await SaveSystem.exportToString();
	}

	onMount(() => {
		startAutoSave();

		window.addEventListener("beforeunload", saveOnUnload);
		window.addEventListener("pagehide", saveOnUnload);
	});

	//@ts-ignore
	let name = PKG_NAME;
	// @ts-ignore
	let version = PKG_VERSION;

  function RotateTheme() {
    let entries = Object.values(ColorTheme).filter(x => typeof x === 'number').map(x => x as ColorTheme);
    let idx = entries.findIndex((e) => e == Settings.Theme); 
    if (idx == -1 || idx >= entries.length -1) 
      idx = 0;
    else 
      idx = idx + 1

    Settings.Theme = entries[idx];
  }

  function RotateNotation() {
    let entries = Object.values(Notation).filter(x => typeof x === 'number').map(x => x as Notation);
    let idx = entries.findIndex((e) => e == Settings.Format); 
    if (idx == -1 || idx >= entries.length -1) 
      idx = 0;
      else 
      idx = idx + 1

    Settings.Format = entries[idx];

    formatter.Notation = Settings.Format;
  }
</script>

<div class="w-full p-2 absolute h-full">
	<div class="w-full flex flex-row space-x-8 text-center pb-4">
		<div class="w-4/12 text-center">
			<h1 class="text-center font-bold">Info</h1>
			<p>{`${name} v${version}`}</p>
			<h1>Time wasted: {formatTime(Player._player.Playtime)}</h1>
		</div>

		<div class="w-4/12 p-2 space-y-1">
			<h1 class="text-center font-bold">Settings</h1>
			<div class="grid grid-cols-2 gap-2">
				<button onclick={RotateNotation} class="w-full">Format Type: {Notation[Settings.Format]}</button>
				<button onclick={RotateTheme} class="w-full">Color Theme: {ColorTheme[Settings.Theme]}</button>
			</div>
		</div>
		<div class="w-4/12 p-2 space-y-1">
			<h1 class="text-center font-bold">Saves</h1>
			<div class="grid grid-cols-2 gap-2">
				<button class="w-full" onclick={saveToClipboard}
					>Save to clipboard</button
				>
				<button class="w-full" onclick={saveToFile}>Save to file</button>
			</div>
			<SaveSlot />
		</div>
	</div>
</div>
