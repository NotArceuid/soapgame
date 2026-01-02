export default {
	darkMode: "class",
	content: ["./src/**/*.{html,js,svelte,ts}"],
	transform: (content) =>
		content.replace(/[[:<:]]dark[[:>:]]/g, "&:where(.dark, .dark *)"),
	theme: {
		extend: {},
	},
	plugins: [],
};
