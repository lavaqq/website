/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: '#3e7d54',
				secondary: '#f0fbec',
			},
			fontFamily: {
				'main': 'JetBrainsMono'
			},
		},
	},
	plugins: [],
}
