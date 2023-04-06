# postcss-color-scheme

[![github.actions.changeset.badge]][github.actions.changeset] [![codecov.badge]][codecov] [![MIT][license.badge]][license] [![npm.badge]][npm]

## [Changelog][changelog]

Postcss plugin ...

Input

```css
```

Output

```css
```

## Installation

```bash
npm install --save-dev postcss postcss-color-scheme
```

Add to your postcss config

```diff
module.exports = {
  plugins: [
+   require('postcss-color-scheme'),
  ],
};
```

## Supported At Rules

| At Rule | Description |
| --- | --- |
<!-- | `@space-x` | Add horizontal spacing between direct children | -->

## Test Cases & Examples

The following table lists test cases covered by this plugin, please refer to [tests][tests] for details and to test input css as examples

| Test Case | Description | Input | Output |
| --- | --- | --- | --- |
| in media queries | `` | [input][tests.in-media-queries.input] | [output][tests.in-media-queries.output] |
| with combined selector | `` | [input][tests.with-combined-selector.input] | [output][tests.with-combined-selector.output] |
| with [postcss-nesting] | `` | [input][tests.with-postcss-nesting.input] | [output][tests.with-postcss-nesting.output] |
| with [postcss-nested] | `` | [input][tests.with-postcss-nested.input] | [output][tests.with-postcss-nested.output] |

[changelog]: ./CHANGELOG.md
[tests]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/src/color-scheme.test.js

[tests.in-media-queries.input]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/src/tests/in-media-queries.input.css
[tests.in-media-queries.output]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/src/tests/in-media-queries.output.css

[tests.with-combined-selector.input]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/src/tests/with-combined-selector.input.css
[tests.with-combined-selector.output]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/src/tests/with-combined-selector.output.css

[tests.with-postcss-nesting.input]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/src/tests/with-postcss-nesting.input.css
[tests.with-postcss-nesting.output]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/src/tests/with-postcss-nest.output.css

[tests.with-postcss-nested.input]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/src/tests/with-postcss-nested.input.css
[tests.with-postcss-nested.output]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/src/tests/with-postcss-nest.output.css

<!-- npm -->
[npm.badge]: https://img.shields.io/npm/v/postcss-color-scheme
[npm]: https://www.npmjs.com/package/postcss-color-scheme

<!-- heading badge -->
[license.badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license]: ./LICENSE
[github.actions.changeset.badge]: https://github.com/vnphanquang/postcss-color-scheme/actions/workflows/changeset.yaml/badge.svg?branch=main
[github.actions.changeset]: https://github.com/vnphanquang/postcss-color-scheme/actions/workflows/changeset.yaml
[codecov.badge]: https://codecov.io/gh/vnphanquang/postcss-color-scheme/branch/main/graph/badge.svg?token=fi6Al6JEGA
[codecov]: https://codecov.io/github/vnphanquang/postcsss-color-scheme?branch=main

[postcss-nesting]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting
[postcss-nested]: https://github.com/postcss/postcss-nested
