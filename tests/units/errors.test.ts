import { invalidParameter, noParameter } from '../../lib/errors';
import { test } from '../context';

test('no parameter - throw', async ({ expect, utils: { compile, css } }) => {
	const input = css` @color-scheme; `;

	await expect(compile(input)).rejects.toThrowError(noParameter());
});

test('no parameter - skip', async ({ expect, utils: { compile, css } }) => {
	const input = css` @color-scheme; `;

	const compiled = await compile(input, {
		options: {
			onInvalidParameter: 'skip',
		},
	});
	expect(compiled).toBe(input);
});

test('invalid parameter - throw', async ({ expect, utils: { compile, css } }) => {
	const input = css` @color-scheme invalid; `;

	await expect(compile(input)).rejects.toThrowError(invalidParameter('invalid'));
});

test('invalid parameter - skip', async ({ expect, utils: { compile, css } }) => {
	const input = css` @color-scheme invalid; `;

	const compiled = await compile(input, {
		options: {
			onInvalidParameter: 'skip',
		},
	});
	expect(compiled).toBe(input);
});

test('empty css', async ({ expect, utils: { compile, css } }) => {
	const input = css``;

	expect(await compile(input)).toMatchInlineSnapshot(`""`);
});
