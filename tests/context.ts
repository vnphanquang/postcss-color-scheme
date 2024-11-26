import path from 'path';

import dedent from 'dedent';
import postcss from 'postcss';
import { expect, test as vTest } from 'vitest';

import plugin from '../package/lib/postcss.js';

async function compile(input: string, plugins: postcss.Plugin[] = []): Promise<string> {
	const { currentTestName } = expect.getState();
	const processor = postcss([plugin(), ...plugins]);
	const result = await processor.process(input, {
		from: `${path.resolve(import.meta.url)}?test=${currentTestName}`,
	});

	return result.css;
}

const css = dedent;

interface TestContext {
	utils: {
		compile: typeof compile;
		css: typeof css;
	};
}

export const test = vTest.extend<TestContext>({
	utils: {
		compile,
		css,
	},
});
