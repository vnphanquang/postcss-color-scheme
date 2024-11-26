import path from 'path';

import { compile } from '@tailwindcss/node';

import { test } from '../context';

test('tailwind v4', async ({ expect, utils }) => {
	const { build } = await compile(
		utils.css`
		@layer base {
			@theme default {
				--color-white: #fff;
				--color-black: #000;
			}
		}
		@import 'tailwindcss/utilities' layer(utilities);
		@import 'postcss-color-scheme/tailwind.css';
	`,
		{
			base: path.resolve(import.meta.dirname),
			onDependency: () => {},
			shouldRewriteUrls: true,
		},
	);

	const candidates = ['light:text-black', 'dark:text-white'];
	const output = build(candidates);
	expect(output).toMatchInlineSnapshot(`
		"/*! tailwindcss v4.0.0-beta.2 | MIT License | https://tailwindcss.com */
		@layer base {
		  :root {
		    --color-white: #fff;
		    --color-black: #000;
		  }
		}
		@layer utilities {
		  .dark\\:text-white {
		    @color-scheme dark {
		      color: var(--color-white);
		    }
		  }
		  .light\\:text-black {
		    @color-scheme dark {
		      color: var(--color-black);
		    }
		  }
		}
		"
	`);
});
