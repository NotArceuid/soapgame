<script lang="ts">
	import { Settings, ColorTheme } from "../Settings.svelte.ts";
</script>

<div class="absolute m-2 w-full">
	<div class="flex flex-row">
		<div>
			<h1>Message from developer:</h1>
			<h1>Thank you for completing the demo...</h1>
			<h1>
				For a while now.. I've been frustrated with incremental games with good
				ui
			</h1>
			<h1>So here's my gift for yall</h1>
			<h1>A shitty game with shitty css</h1>
			<br />
			<h1>There's still more content i'm planning to add</h1>
			<h1>the game will be updated semi regularly (hopefully)</h1>
			<h1>I'm not the type that easily forget passwords btw >:(</h1>
			<h1>(spam ping me if i forget)</h1>
			<br />
			<h1>Below this is the community discord</h1>
			<h1>Sometimes i'll post progress here</h1>
			<a href="https://discord.gg/AvzwHzCH7C" class="underline text-blue-400"
				>https://discord.gg/AvzwHzCH7C</a
			>
			<h1>Oh yea.. the repo is also on my github</h1>
			<h1>Contributors are welcomed :)</h1>

			<br />
			<h1 class="underline">Special thanks to:</h1>
			<ul>
				<li>My friends from high school whom i coerced to playtest the game</li>
			</ul>
			<br />
			<h1>This page will get nuked in the next update. lol</h1>
			<h1>Screenshoot it if you want</h1>
			<h1 style="font-size: 0.3rem;">I use arch btw</h1>
		</div>
		<div class="ml-auto">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<img
				src={`/fatcat-${Settings.Theme == ColorTheme.Dark ? "dark" : "light"}.png`}
				alt="dumbcat"
				onclick={() => {
					const audio = new Audio("/meow.wav");
					audio.play();
				}}
			/>
			<h1 class="text-center">Cat i drew (click for sounds)</h1>
		</div>
	</div>
</div>
