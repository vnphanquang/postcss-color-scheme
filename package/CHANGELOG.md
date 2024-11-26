# postcss-color-scheme

## 2.0.0

### Major Changes

- [`f879aff`](https://github.com/vnphanquang/postcss-color-scheme/commit/f879aff9538f1537b6b92e99423205d343a0d7cd) Thanks [@vnphanquang](https://github.com/vnphanquang)! - [BREAKING] drop `:global` variant to avoid ambiguity. User may use `:global` manually. In Svelte 5, for example, you can now declare a `:global` style block, e.g. `:global { .class { @color-scheme dark { /* ... */ } } }`;

- [`f879aff`](https://github.com/vnphanquang/postcss-color-scheme/commit/f879aff9538f1537b6b92e99423205d343a0d7cd) Thanks [@vnphanquang](https://github.com/vnphanquang)! - [BREAKING] drop `@light` and `@dark` at-rules in favor for a single coherent `@color-scheme` at-rule, i.e `@color-scheme dark { /* ... */ }` or `@color-scheme light { /* ... */ }`

- [`f879aff`](https://github.com/vnphanquang/postcss-color-scheme/commit/f879aff9538f1537b6b92e99423205d343a0d7cd) Thanks [@vnphanquang](https://github.com/vnphanquang)! - [BREAKING] drop tailwind plugin. In Tailwind V4, simply add `@import 'postcss-color-scheme/tailwind.css'` to tailwind-aware context to make `light:` and `dark:` variants available for use in markup. See [README.md](https://github.com/vnphanquang/postcss-color-scheme/blob/main/README.md) for more information

- [`f879aff`](https://github.com/vnphanquang/postcss-color-scheme/commit/f879aff9538f1537b6b92e99423205d343a0d7cd) Thanks [@vnphanquang](https://github.com/vnphanquang)! - [BREAKING] no longer handle nesting now that the standardized [CSS Nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting) has landed (leave up to other transformer to support older browser or not)
