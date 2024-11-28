import { invalidParameter, noParameter } from '../../lib/errors';
import { test } from '../context';

test('with valid parameter', async ({ expect, utils: { compile, css } }) => {
	const compiled = await compile(
		css`
			html {
				--color: black;

				@media dark {
					--color: white;
				}
			}
		`,
		{
			options: {
				name: 'media',
			},
		},
	);
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

test('with invalid parameter - automatically skip', async ({ expect, utils: { compile, css } }) => {
	const compiled = await compile(
		css`
			html {
				--color: black;

				@media (width >= 48rem) {
					--color: white;
				}
			}
		`,
		{
			options: {
				name: 'media',
			},
		},
	);
	expect(compiled).toMatchInlineSnapshot(`
			"html {
				--color: black;

				@media (width >= 48rem) {
					--color: white;
				}
			}"
		`);
});

test('with no parameter - force throw', async ({ expect, utils: { compile, css } }) => {
	await expect(
		compile(
			css`
				html {
					--color: black;

					@media {
						--color: white;
					}
				}
			`,
			{
				options: {
					name: 'media',
					onInvalidParameter: 'throw',
				},
			},
		),
	).rejects.toThrowError(noParameter());
});

test('with invalid parameter', async ({ expect, utils: { compile, css } }) => {
	await expect(
		compile(
			css`
				html {
					--color: black;

					@media invalid {
						--color: white;
					}
				}
			`,
			{
				options: {
					name: 'media',
					onInvalidParameter: 'throw',
				},
			},
		),
	).rejects.toThrowError(invalidParameter('invalid'));
});
