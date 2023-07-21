import fs from 'fs';
import { resolve } from 'path';

import postcss from 'postcss';
import postcssJs from 'postcss-js';
import postcssNested from 'postcss-nested';
import postcssNesting from 'postcss-nesting';
import { test, expect, describe } from 'vitest';

import plugin from './color-scheme';

/**
 * @param {string} path
 */
function readCSS(path) {
  return fs.readFileSync(resolve(__dirname, path), 'utf8');
}

/**
 *
 * @param {string} expected
 * @param {string} actual
 */
function compareCSS(expected, actual) {
  const actualObject = postcssJs.objectify(postcss.parse(actual));
  const expectedObject = postcssJs.objectify(postcss.parse(expected));
  expect(actualObject).toEqual(expectedObject);
}

test('simple usage', async () => {
  const input = readCSS('./tests/simple.input.css');
  const output = readCSS('./tests/simple.output.css');

  /** @type {any} */
  const processor = postcss([plugin()]);
  const result = await processor.process(input, { from: undefined });

  compareCSS(output, result.css);
});

test('usage combined selector', async () => {
  const input = readCSS('./tests/with-combined-selector.input.css');
  const output = readCSS('./tests/with-combined-selector.output.css');

  /** @type {any} */
  const processor = postcss([plugin()]);
  const result = await processor.process(input, { from: undefined });

  compareCSS(output, result.css);
});

test('usage in media queries', async () => {
  const input = readCSS('./tests/in-media-queries.input.css');
  const output = readCSS('./tests/in-media-queries.output.css');

  /** @type {any} */
  const processor = postcss([plugin()]);
  const result = await processor.process(input, { from: undefined });

  compareCSS(output, result.css);
});

describe('usage with postcss-nesting', async () => {
  const input = readCSS('./tests/with-postcss-nesting.input.css');
  const output = readCSS('./tests/with-postcss-nest.output.css');

  test('| defined before postcss-nesting', async () => {
    /** @type {any} */
    const processor = postcss([plugin(), postcssNesting]);
    const result = await processor.process(input, { from: undefined });
    compareCSS(output, result.css);
  });

  test('| defined after postcss-nesting', async () => {
    /** @type {any} */
    const processor = postcss([postcssNesting, plugin()]);
    const result = await processor.process(input, { from: undefined });
    compareCSS(output, result.css);
  });
});

describe('usage with postcss-nested', async () => {
  const input = readCSS('./tests/with-postcss-nested.input.css');
  const output = readCSS('./tests/with-postcss-nest.output.css');

  test('| defined before postcss-nested', async () => {
    /** @type {any} */
    const processor = postcss([plugin(), postcssNested]);
    const result = await processor.process(input, { from: undefined });
    compareCSS(output, result.css);
  });

  test('| defined after postcss-nested', async () => {
    /** @type {any} */
    const processor = postcss([postcssNested, plugin()]);
    const result = await processor.process(input, { from: undefined });
    compareCSS(output, result.css);
  });
});

test('unsupported parameter', async () => {
  const input = 'input { @dark meow { color: red } }';
  /** @type {any} */
  const processor = postcss([plugin()]);
  await expect(
    processor.process(input, { from: undefined })
  ).rejects.toThrowError(/Invalid parameter/);
});

test('selector is html itself', async () => {
  const input = readCSS('./tests/selector-is-html.input.css');
  const output = readCSS('./tests/selector-is-html.output.css');

  /** @type {any} */
  const processor = postcss([postcssNesting, plugin()]);
  const result = await processor.process(input, { from: undefined });

  compareCSS(output, result.css);
});

test('inside :global', async () => {
  const input = readCSS('./tests/inside-global.input.css');
  const output = readCSS('./tests/inside-global.output.css');

  /** @type {any} */
  const processor = postcss([plugin()]);
  const result = await processor.process(input, { from: undefined });

  compareCSS(output, result.css);
});

test('used at root', async () => {
  const input = '@dark { color: red }';
  /** @type {any} */
  const processor = postcss([plugin()]);
  await expect(
    processor.process(input, { from: undefined })
  ).rejects.toThrowError(/Expect @dark to be nested in a selector./);
});
