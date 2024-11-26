import { test } from '../context';

test('nested in simple rule', async ({ expect, utils: { compile, css } }) => {
	const compiled = await compile(css`
		.class,
		#id,
		tag {
			--color: black;

			@color-scheme dark {
				--color: white;
			}
		}
	`);
	expect(compiled).toMatchInlineSnapshot(`
		".class,
		#id,
		tag {
			--color: black;

			@media (prefers-color-scheme: dark) {

				html:not([data-color-scheme="light"]) & {
				--color: white
				}
			}

			html[data-color-scheme="dark"] & {
				--color: white
			}
		}"
	`);
});

test('nested in media rule', async ({ expect, utils: { compile, css } }) => {
	const compiled = await compile(css`
		.class,
		#id,
		tag {
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
		".class,
		#id,
		tag {
			--color: black;

			@media (width >= 48rem) {
				--color: gray;

				@media (prefers-color-scheme: dark) {

					html:not([data-color-scheme="light"]) & {
					--color: white
					}
				}

				html[data-color-scheme="dark"] & {
					--color: white
				}
			}
		}"
	`);
});
