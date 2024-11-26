import postcssColorScheme from 'postcss-color-scheme';
import { defineConfig } from 'vite';

export default defineConfig({
	css: {
		transformer: 'postcss',
		postcss: {
			plugins: [postcssColorScheme()],
		},
	},
});
