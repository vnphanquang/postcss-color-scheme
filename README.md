# postcss-color-scheme

[![github.actions.changesets.badge]][github.actions.changesets] [![codecov.badge]][codecov] [![MIT][license.badge]][license] [![npm.badge]][npm]

Postcss plugin for handling `prefers-color-scheme`, plus [Tailwind V4 variants](#tailwind-support) (optional).

Input

```css
.my-class {
	color: black;

	@color-scheme dark {
		color: white;
	}
}
```

Output

```css
.my-class {
	color: black;

	html[data-color-scheme='dark'] & {
		color: white;
	}

	@media (prefers-color-scheme: dark) {
		html:not([data-color-scheme='light']) & {
			color: white;
		}
	}
}
```

> [!NOTE]
> Notice `postcss-color-scheme` preserves [CSS nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting) as it has landed in all major browsers as of this writing. If you need to target older browsers, consider adding additional transform with [postcss-nesting] (not [postcss-nested]).

## [Changelog][changelog]

## Installation

```bash
npm install --save-dev postcss postcss-color-scheme
yarn add -D postcss postcss-color-scheme
pnpm add -D postcss postcss-color-scheme
```

Add to your postcss config

```javascript
/* @file: postcss.config.js */
import postcssColorScheme from 'postcss-color-scheme';

export default {
	plugins: [postcssColorScheme()],
};
```

## Design Decisions

You might have noticed a couple of opinionated code at the top of this document. These are extracted from my daily work, and currently serve my use cases very well. Should you have concerns, suggestions for improvements, or solution for making this more generic, feel free to open an issue. Thanks!

1.  Rely on `data-color-scheme` for explicit theme settings. This requires setting `data-color-scheme` on the `html` element.

2.  Provide fallback when user has not explicitly select a theme. Let's refer to the demo above, with rules enumerated:

    ```css
    /* (1) */
    .my-class {
    	color: black;
    }

    /* (2) */
    html[data-color-scheme='dark'] .my-class {
    	color: white;
    }

    /* (3) */
    @media (prefers-color-scheme: dark) {
    	html:not([data-color-scheme='light']) .my-class {
    		color: white;
    	}
    }
    ```

    Imagine your system provides 3 options: `dark`, `light`, and `system` (default, auto, i.e respect system preferences). There are 4 possible scenarios.

    1.  User has not explicitly selected a theme (theme = `system`), and the system prefers `light` (`prefers-color-scheme` = `light`):

        --> (1) applies.

    2.  User has not explicitly selected a theme (theme = `system`), and the system prefers `dark`
        (`prefers-color-scheme` = `dark`):

            --> (1) & (3) applies, (3) takes precedence because of its higher specificity.

    3.  User selected `dark` (`data-color-theme` set to `dark` on `html`) :

        --> (1) & (2) applies, (2) takes precedence because of its higher specificity.

    4.  User selected `light` (`data-color-theme` set to `light` on `html`) :

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
## What about the [light-dark()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) Function?

As of this writing, the `light-dark()` CSS function already has pretty good support across browsers,
and is a valid solution to handle light-dark mode. However, colors declared with
`light-dark` are not as flexible. Consider the following setup:

```css
:root {
	--regular-color: green;
	--light-dark-color: light-dark(red, blue);
}
```

We can use utilize the relatively new [relative color syntax]() with `--regular-color`...

```css
.regular {
	/* turn from green to redish while keeping perceived lightness and chroma */
	color: oklch(from var(--regular-color) l c calc(h - 120));
}
```

...while it is not possible today with `light-dark`:

```css
.light-dark {
	 /* invalid and ignored by browser */
	color: oklch(from var(--light-dark-color) l c calc(h - 120));
}
```

Although [color-mix](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix) does seem to
work. Overall, until browser has better support for `light-dark`, `postcss-color-scheme` provides
a more universal solution.

## The `color-scheme` At-Rule

This plugin essentially provides a new at-rule, `@color-scheme`; it requires a parameter with value
of either `dark` or `light`.

```css
:root {
	@color-scheme light {
		color: black;
	}

	@color-scheme dark {
		color: white;
	}
}
```

## Usage in Svelte Style Tag

Styling in Svelte is component-scoped by default. From Svelte 5, you can wrap the `@color-scheme` at-rule in a `:global` block. For example:

```svelte
<main></main>

<style lang="postcss">
	:global {
		main {
			@color-scheme dark {
				color: white;
			}
		}
	}
</style>
```

## [Tailwind] Support

From Tailwind V4, simply add the following to your CSS:

```css
/* app.css, or any Tailwind-aware context */
@import 'tailwindcss';
@import 'postcss-color-scheme/tailwind.css';
```

This exposes the `light:` and `dark:` variants for usage in markup. For example:

```html
<input class="text-white dark:text-black light:border-gray-500" />
```

Note that these variants and the `@color-scheme` at-rule are complementary and not exclusive. Feel
free to use both: the former is for markup, while the latter is for CSS.

> [!NOTE]
> For Tailwind V3 and below, please use [postcss-color-scheme v1][v1].

[changelog]: ./CHANGELOG.md
[v1]: https://github.com/vnphanquang/postcss-color-scheme/tree/v1.0.1

<!-- npm -->

[npm.badge]: https://img.shields.io/npm/v/postcss-color-scheme
[npm]: https://www.npmjs.com/package/postcss-color-scheme

<!-- heading badge -->

[license.badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license]: ./LICENSE
[github.actions.changesets.badge]: https://github.com/vnphanquang/postcss-color-scheme/actions/workflows/changesets.yaml/badge.svg?branch=main
[github.actions.changesets]: https://github.com/vnphanquang/postcss-color-scheme/actions/workflows/changesets.yaml
[codecov.badge]: https://codecov.io/gh/vnphanquang/postcss-color-scheme/branch/main/graph/badge.svg?token=fi6Al6JEGA
[codecov]: https://codecov.io/github/vnphanquang/postcss-color-scheme?branch=main
[postcss-nesting]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting
[postcss-nested]: https://github.com/postcss/postcss-nested
[tailwind]: https://tailwindcss.com/
