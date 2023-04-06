import { test, expect, describe } from 'vitest';
import fs from 'fs';
import { resolve } from 'path';
import plugin from './color-scheme';
import postcss from 'postcss';
import postcssNesting from 'postcss-nesting';
import postcssNested from 'postcss-nested';
import postcssJs from 'postcss-js';

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

  const processor = postcss([plugin()]);
  const result = await processor.process(input, { from: undefined });

  compareCSS(output, result.css);
});

test('usage combined selector', async () => {
  const input = readCSS('./tests/with-combined-selector.input.css');
  const output = readCSS('./tests/with-combined-selector.output.css');

  const processor = postcss([plugin()]);
  const result = await processor.process(input, { from: undefined });

  compareCSS(output, result.css);
});

test('usage in media queries', async () => {
  const input = readCSS('./tests/in-media-queries.input.css');
  const output = readCSS('./tests/in-media-queries.output.css');

  const processor = postcss([plugin()]);
  const result = await processor.process(input, { from: undefined });

  compareCSS(output, result.css);
});

describe('usage with postcss-nesting', async () => {
  const input = readCSS('./tests/with-postcss-nesting.input.css');
  const output = readCSS('./tests/with-postcss-nest.output.css');

  test('| defined before postcss-nesting', async () => {
    const processor = postcss([plugin(), postcssNesting]);
    const result = await processor.process(input, { from: undefined });
    compareCSS(output, result.css);
  });

  test('| defined after postcss-nesting', async () => {
    const processor = postcss([postcssNesting, plugin()]);
    const result = await processor.process(input, { from: undefined });
    compareCSS(output, result.css);
  });
});

describe('usage with postcss-nested', async () => {
  const input = readCSS('./tests/with-postcss-nested.input.css');
  const output = readCSS('./tests/with-postcss-nest.output.css');

  test('| defined before postcss-nested', async () => {
    const processor = postcss([plugin(), postcssNested]);
    const result = await processor.process(input, { from: undefined });
    compareCSS(output, result.css);
  });

  test('| defined after postcss-nested', async () => {
    const processor = postcss([postcssNested, plugin()]);
    const result = await processor.process(input, { from: undefined });
    compareCSS(output, result.css);
  });
});
