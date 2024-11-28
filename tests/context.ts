import path from 'path';

import dedent from 'dedent';
import postcss from 'postcss';
import { expect, test as vTest } from 'vitest';

import plugin from '../lib/postcss.js';

type CompileConfig = {
	options?: Parameters<typeof plugin>[0];
	plugins?: postcss.AcceptedPlugin[];
};

async function compile(input: string, config: CompileConfig = {}): Promise<string> {
	const { currentTestName } = expect.getState();
	const processor = postcss([plugin(config.options), ...(config.plugins ?? [])]);
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
