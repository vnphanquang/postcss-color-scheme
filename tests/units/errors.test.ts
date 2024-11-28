import { invalidParameter, noParameter } from '../../lib/errors';
import { test } from '../context';

test('no parameter', async ({ expect, utils: { compile, css } }) => {
	const input = css` @color-scheme; `;

	await expect(compile(input)).rejects.toThrowError(noParameter());
});

test('invalid parameter', async ({ expect, utils: { compile, css } }) => {
	const input = css` @color-scheme invalid; `;

	await expect(compile(input)).rejects.toThrowError(invalidParameter('invalid'));
});

test('empty css', async ({ expect, utils: { compile, css } }) => {
	const input = css``;

	expect(await compile(input)).toMatchInlineSnapshot(`""`);
});
