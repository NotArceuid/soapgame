<script lang="ts">
	import ColorPicker from "svelte-awesome-color-picker";
	import {
		ColorTheme,
		InvertedTextColor,
		RandomiseColors,
		SaveColors,
	} from "./Settings.svelte.ts";
	import { SaveSystem } from "../../Game/Saves.ts";
	import { onMount } from "svelte";
	import { _ } from "svelte-i18n";

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

	async function loadFromClipboard() {
		try {
			const clipboardText = await navigator.clipboard.readText();
			if (clipboardText) {
				const success = await SaveSystem.importFromString(clipboardText);
				saveStatus = success
					? $_("settings.saves.loadsave")
					: $_("settings.saves.savefailed");
			} else {
				saveStatus = $_("settings.saves.emptyclipboard");
			}
			setTimeout(() => (saveStatus = ""), 2000);
		} catch {}
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

	function loadFromFile(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = async (e) => {
			try {
				const content = e.target?.result as string;
				if (content) {
					const success = await SaveSystem.importFromString(content);
					saveStatus = success
						? $_("settings.saves.loadsave")
						: $_("settings.saves.loadfailed");
				}
			} catch {
				saveStatus = $_("settings.saves.loadfailed");
			}
			setTimeout(() => (saveStatus = ""), 2000);
		};
		reader.readAsText(file);
		input.value = "";
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
</script>

<div class="absolute justify-center w-full">
	<div class="w-full justify-center flex items-center mb-12 gap-10">
		<button onclick={saveToFile}>Save to File</button>
		<button onclick={saveToClipboard}>Save to Clipboard</button>
		<input type="file" accept=".txt, .json" onchange={loadFromFile} />
		<button onclick={loadFromClipboard}>Load from Clipboard</button>
	</div>

	{#if saveStatus}
		<div class="save-status text-center mb-4">{saveStatus}</div>
	{/if}

	<div>
		<h2 class="text-center">Color Theme Configuration</h2>

		<div
			class="grid sm:lg-grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pl-10 pr-10"
		>
			<ColorPicker label="Main Background Color" bind:rgb={ColorTheme.MainBg} />
			<ColorPicker
				label="Resource Panel Background"
				bind:rgb={ColorTheme.ResourcePanelBg}
			/>
			<ColorPicker
				label="Navigation Background"
				bind:rgb={ColorTheme.NavigationBg}
			/>
			<ColorPicker label="Overlay Background" bind:rgb={ColorTheme.OverlayBg} />
			<ColorPicker label="Tooltip Background" bind:rgb={ColorTheme.TooltipBg} />
			<ColorPicker
				label="Action Active Border Color"
				bind:rgb={ColorTheme.ActiveBorderColor}
			/>
			<ColorPicker
				label="Action Hover/Disabled Color"
				bind:rgb={ColorTheme.HoverActiveColor}
			/>
			<ColorPicker label="Action Background" bind:rgb={ColorTheme.ActionBg} />
			<ColorPicker label="Border Color" bind:rgb={ColorTheme.BorderColor} />
			<button onclick={() => RandomiseColors()}>Random Color</button>
			<input type="checkbox" bind:checked={InvertedTextColor.val} />
			<button onclick={() => SaveColors()}>Save Colors</button>
		</div>
	</div>
</div>

<style>
	.save-status {
		padding: 0.5rem;
		background: #e2e8f0;
		border-radius: 0.375rem;
		font-weight: bold;
	}
</style>
