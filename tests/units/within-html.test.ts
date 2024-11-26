import { test } from '../context';

test('nested in within html', async ({ expect, utils: { compile, css } }) => {
	const compiled = await compile(css`
		html {
			--color: black;

			@color-scheme dark {
				--color: white;
			}
		}
	`);
	expect(compiled).toMatchInlineSnapshot(`
		"html {
			--color: black;

			@media (prefers-color-scheme: dark) {

				&:not([data-color-scheme="light"]) {
				--color: white
				}
			}

			&[data-color-scheme="dark"] {
				--color: white
			}
		}"
	`);
});

test('nested in media query in html', async ({ expect, utils: { compile, css } }) => {
	const compiled = await compile(css`
		html {
			--color: white;

			@media (width >= 48rem) {
				--color: gray;

				@color-scheme light {
					--color: black;
				}
			}
		}
	`);

	expect(compiled).toMatchInlineSnapshot(`
		"html {
			--color: white;

			@media (width >= 48rem) {
				--color: gray;

				@media (prefers-color-scheme: light) {

					&:not([data-color-scheme="dark"]) {
					--color: black
					}
				}

				&[data-color-scheme="light"] {
					--color: black
				}
			}
		}"
	`);
});

test('nested in within :root', async ({ expect, utils: { compile, css } }) => {
	const compiled = await compile(css`
		:root {
			--color: black;

			@color-scheme light {
				--color: white;
			}
		}
	`);
	expect(compiled).toMatchInlineSnapshot(`
		":root {
			--color: black;

			@media (prefers-color-scheme: light) {

				&:not([data-color-scheme="dark"]) {
				--color: white
				}
			}

			&[data-color-scheme="light"] {
				--color: white
			}
		}"
	`);
});

test('nested in media query in :root', async ({ expect, utils: { compile, css } }) => {
	const compiled = await compile(css`
		:root {
			--color: black;

			@media (width >= 48rem) {
				--color: gray;

				@color-scheme dark {
					--color: white;
				}
			}
		}
	`);

	expect(compiled).toMatchInlineSnapshot(`
		":root {
			--color: black;

			@media (width >= 48rem) {
				--color: gray;

				@media (prefers-color-scheme: dark) {

					&:not([data-color-scheme="light"]) {
					--color: white
					}
				}

				&[data-color-scheme="dark"] {
					--color: white
				}
			}
		}"
	`);
});
