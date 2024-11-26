import path from 'path';

import { build, Rollup } from 'vite';

import { test } from '../context';

test('vite + postcss', async ({ expect }) => {
	const { output } = (await build({
		root: path.resolve(import.meta.dirname),
		build: {
			cssMinify: false,
		},
	})) as Rollup.RollupOutput;
	const css = (output.find((c) => c.name === 'index.css') as Rollup.OutputAsset)?.source;
	expect(css).toMatchInlineSnapshot(`
		":root {
			--color: gray;

			@media (prefers-color-scheme: light) {

				&:not([data-color-scheme="dark"]) {
				--color: black
				}
			}

			&[data-color-scheme="light"] {
				--color: black
			}

			@media (prefers-color-scheme: dark) {

				&:not([data-color-scheme="light"]) {
				--color: white
				}
			}

			&[data-color-scheme="dark"] {
				--color: white
			}
		}
		"
	`);
});
