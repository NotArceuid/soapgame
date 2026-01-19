<script lang="ts">
	import { asset, base } from "$app/paths";
	import { ColorTheme, Settings } from "./Pages/Settings.svelte.ts";

	interface Props {
		active?: boolean;
		speed?: number;
		logoSize?: number;
	}

	const { active = true, speed = 2, logoSize = 120 }: Props = $props();

	let x = $state<number>(50);
	let y = $state<number>(50);
	let dx = $state<number>(1);
	let dy = $state<number>(1);
	let animationFrame: number | undefined;

	let containerWidth = $state<number>(0);
	let containerHeight = $state<number>(0);
	let container: HTMLDivElement | undefined = $state();

	function updatePosition(): void {
		if (!container || containerWidth <= 0 || containerHeight <= 0) return;

		x += dx;
		y += dy;

		const hitLeft = x <= 0;
		const hitRight = x + logoSize >= containerWidth;
		const hitTop = y <= 0;
		const hitBottom = y + logoSize >= containerHeight;

		if (hitLeft || hitRight) {
			dx = -dx;
			if (hitLeft) x = 0;
			if (hitRight) x = containerWidth - logoSize;
		}

		if (hitTop || hitBottom) {
			dy = -dy;
			if (hitTop) y = 0;
			if (hitBottom) y = containerHeight - logoSize;
		}
	}

	function animate(timestamp: number): void {
		if (!active) return;

		updatePosition();
		animationFrame = requestAnimationFrame(animate);
	}

	function handleResize(): void {
		if (!container) return;

		const prevWidth = containerWidth;
		const prevHeight = containerHeight;

		containerWidth = container.clientWidth;
		containerHeight = container.clientHeight;

		if (prevWidth !== containerWidth || prevHeight !== containerHeight) {
			x = Math.min(Math.max(0, x), Math.max(0, containerWidth - logoSize));
			y = Math.min(Math.max(0, y), Math.max(0, containerHeight - logoSize));

			if (
				prevWidth === 0 &&
				prevHeight === 0 &&
				containerWidth > 0 &&
				containerHeight > 0
			) {
				x = Math.min(50, containerWidth - logoSize);
				y = Math.min(50, containerHeight - logoSize);
			}
		}
	}

	$effect(() => {
		if (dx !== 0) dx = Math.sign(dx) * speed;
		if (dy !== 0) dy = Math.sign(dy) * speed;
	});

	$effect(() => {
		if (!container) return;

		const resizeObserver = new ResizeObserver(() => {
			handleResize();
		});

		resizeObserver.observe(container);

		requestAnimationFrame(() => {
			handleResize();
		});

		return () => {
			resizeObserver.disconnect();
		};
	});

	$effect(() => {
		// Clean up any existing animation
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
			animationFrame = undefined;
		}

		// Start animation if conditions are met
		if (active && container && containerWidth > 0 && containerHeight > 0) {
			animationFrame = requestAnimationFrame(animate);
		}

		return () => {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
				animationFrame = undefined;
			}
		};
	});
</script>

<div bind:this={container} class="w-full h-full relative overflow-hidden">
	<img
		src={asset(
			`/fatcat-${Settings.Theme == ColorTheme.Dark ? "dark" : "light"}.png`,
		)}
		alt="DVD Logo"
		class="absolute"
		style="width: {logoSize}px; height: {logoSize}px; left: {x}px; top: {y}px;"
	/>
</div>
