# postcss-color-scheme

[![github.actions.changeset.badge]][github.actions.changeset] [![codecov.badge]][codecov] [![MIT][license.badge]][license] [![npm.badge]][npm]

## [Changelog][changelog]

Postcss plugin for handling `prefers-color-scheme`, plus [tailwind support](#tailwind-support)

Input

```css
.my-class {
  color: black;
  @dark {
    color: white;
  }
}
```

Output

```css
.my-class {
  color: black;
}

html[data-color-scheme="dark"] .my-class {
  color: white;
}

@media (prefers-color-scheme: dark) {
  html:not([data-color-scheme="light"]) .my-class {
    color: white;
  }
}
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

## Design Decisions

You might have noticed a couple of opinionated code at the top of this document. These are extracted from my daily work, and currently serve my use cases very well. Should you have concerns, suggestions for improvements, or solution for making this more generic, feel free to open an issue. Thanks!

1. Rely on `data-color-scheme` for explicit theme settings. This requires setting `data-color-scheme` on the root html element.

2. Provide fallback when user has not explicitly select a theme. Let's refer to the demo above, with rules enumerated:

    ```css
      /* (1) */
      .my-class {
        color: black;
      }

      /* (2) */
      html[data-color-scheme="dark"] .my-class {
        color: white;
      }

      /* (3) */
      @media (prefers-color-scheme: dark) {
        html:not([data-color-scheme="light"]) .my-class {
          color: white;
        }
      }
    ```

    Imagine your system provides 3 options: `dark`, `light`, and `system` (default, auto, i.e respect system preferences). There are 4 possible scenarios.

    1. User has not explicitly selected a theme (theme = `system`), and the system prefers `light` (`prefers-color-scheme` = `light`):

        --> (1) applies.

    2. User has not explicitly selected a theme (theme = `system`), and the system prefers `dark`
    (`prefers-color-scheme` = `dark`):

        --> (1) & (3) applies, (3) takes precedence because of its higher specificity.

    3. User selected `dark` (`data-color-theme` set to `dark` on root html) :

        --> (1) & (2) applies, (2) takes precedence because of its higher specificity.

    4. User selected `light` (`data-color-theme` set to `light` on root html) :

        --> (1) applies.

    ```mermaid
    flowchart TD
        A[Has user explicitly selected theme?] -->|Yes| B[Which mode?]
        B --> Light
        B --> Dark
        A -->|No| C[prefers-color-scheme?]
        C -->Light
        C -->Dark
    ```

## Supported At Rules

| At Rule | Description |
| --- | --- |
| `@dark` | apply rules for dark color scheme |
| `@light` | apply rules for light color scheme |

## Global Variant

`postcss-color-scheme` supports the `:global` syntax, often seen in css modules and similar systems.

Input

```css
.my-class {
  @dark global {
    color: white;
  }
}
```

```css
:global(html[data-color-scheme="dark"]) .my-class {
  color: white;
}
@media (prefers-color-scheme: dark) {
  :global(html:not([data-color-scheme="light"])) .my-class {
    color: white;
  }
}
```

## Test Cases & Examples

The following table lists test cases covered by this plugin, please refer to [tests][tests] for details and to tests' input css as examples

| Test Case | Description | Input | Output |
| --- | --- | --- | --- |
| nest in other media queries | `@media (min-width: 768px) { .my-class { @dark { color: white } } }` | [input][tests.in-media-queries.input] | [output][tests.in-media-queries.output] |
| with combined selector | `.my-class, .others { @dark { color: white } }` | [input][tests.with-combined-selector.input] | [output][tests.with-combined-selector.output] |
| with selector at `html`| `` | [input][tests.with-selector-at-html.input] | [output][tests.with-selector-at-html.output] |
| with [postcss-nesting] | `.my-class { & .nested { @dark { color: white } } }` | [input][tests.with-postcss-nesting.input] | [output][tests.with-postcss-nesting.output] |
| with [postcss-nested] | `.my-class { .nested { @dark { color: white } } }` | [input][tests.with-postcss-nested.input] | [output][tests.with-postcss-nested.output] |

## [Tailwind] Support

Make sure you have installed and configured `tailwindcss`.

```bash
npm install --save-dev tailwindcss
```

Add `postcss-color-scheme` to your [tailwind] config as a plugin, and turn off the default `darkMode` handling.

```js
/** @type {import("tailwindcss").Config } */
module.exports = {
  // your config ...
  darkMode: '',
  plugins: [require('postcss-color-scheme/lib/tailwind')],
};
```

Now, the following is available:

```html
<input class="text-white dark:text-black light:border-gray-500">
```

[changelog]: ./CHANGELOG.md
[tests]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/lib/color-scheme.test.js

[tests.in-media-queries.input]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/lib/tests/in-media-queries.input.css
[tests.in-media-queries.output]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/lib/tests/in-media-queries.output.css

[tests.with-combined-selector.input]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/lib/tests/with-combined-selector.input.css
[tests.with-combined-selector.output]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/lib/tests/with-combined-selector.output.css

[tests.with-postcss-nesting.input]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/lib/tests/with-postcss-nesting.input.css
[tests.with-postcss-nesting.output]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/lib/tests/with-postcss-nest.output.css

[tests.with-postcss-nested.input]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/lib/tests/with-postcss-nested.input.css
[tests.with-postcss-nested.output]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/lib/tests/with-postcss-nest.output.css

[tests.with-selector-at-html.input]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/lib/tests/selector-is-html.input.css
[tests.with-selector-at-html.output]: https://github.com/vnphanquang/postcss-color-scheme/blob/main/lib/tests/selector-is-html.output.css

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
[tailwind]: https://tailwindcss.com/
