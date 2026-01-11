<script lang="ts">
	import {
		AchievementKey,
		AchievementsData,
	} from "../../../Game/Achievements/Achievements.svelte";

	let { idx }: { idx: number } = $props();
	let achievement = $derived(AchievementsData[idx as AchievementKey]);
	let unlocked = $derived(achievement.unlocked ? "bg-green-200/60" : "");
</script>

<div class="border {unlocked} m-2 p-2 min-w-xs min-h-24 max-w-xs">
	<div class="flex flex-row">
		<h1 class="border-b w-full font-bold">{achievement.name}</h1>
		<h1 class="font-semibold">#{idx}</h1>
	</div>
	<h1 class="text-sm">{achievement.description}</h1>
</div>
