<script lang="ts">
	import { onMount } from "svelte";
	import { type INotification } from "./Notification.svelte";
	let { data, done = $bindable() }: { data: INotification; done: () => void } =
		$props();

	onMount(() => {
		setTimeout(() => {
			done();
		}, 2500);
	});
</script>

<div
	class="border p-2 min-w-74 min-h-32 max-w-84 overflow-y-auto opacity-100 bg-bg
  transition-all duration-300 ease-in-out"
>
	<div class="flex flex-row border-b">
		<h1 class="text-center wrap-break-word">{data?.name}</h1>
		<button
			class="max-w-6 min-h-6 p-0 m-0 ml-auto flex items-center justify-center"
			>X</button
		>
	</div>
	<h1 class="m-2 wrap-break-words">{data?.description}</h1>
</div>
