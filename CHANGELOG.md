# Changelog

## 1.0.0

### Major Changes

- [`47ca0d3`](https://github.com/vnphanquang/postcss-color-scheme/commit/47ca0d3e1abc4f24d7a5ab6723c1e19e20c4d005) Thanks [@vnphanquang](https://github.com/vnphanquang)! - [BREAKING] more predictable public exports with typescript support

## 0.3.2

### Patch Changes

- [`65916b0`](https://github.com/vnphanquang/postcss-color-scheme/commit/65916b0c7bf563b2ed97f8468592aec5343a1873) Thanks [@vnphanquang](https://github.com/vnphanquang)! - added test case where used in deeply nested selectors

- [`7acd332`](https://github.com/vnphanquang/postcss-color-scheme/commit/7acd332da371d1699846411e3684ea78fd7e005e) Thanks [@vnphanquang](https://github.com/vnphanquang)! - fix broken links in README, add missing reference to test case

- [`5b946c3`](https://github.com/vnphanquang/postcss-color-scheme/commit/5b946c317f06b380b925453d18b6bdb3b3ae9789) Thanks [@vnphanquang](https://github.com/vnphanquang)! - add test case for where there are child rules in `@dark` and `@light`

- [`d3d86b6`](https://github.com/vnphanquang/postcss-color-scheme/commit/d3d86b61b2bf2e99069cfd58fae0ff3e0d3955a3) Thanks [@vnphanquang](https://github.com/vnphanquang)! - add to docs clarification that tailwind & postcss plugins can be used together, not one or the other

- [`f4f9c80`](https://github.com/vnphanquang/postcss-color-scheme/commit/f4f9c80607aaadd6af9bd9bd37052a0c234874d9) Thanks [@vnphanquang](https://github.com/vnphanquang)! - add support for `:root` selector; i.e `:root { @dark { /* ... */ } }`

## 0.3.1

### Patch Changes

- [`2b39ee9`](https://github.com/vnphanquang/postcss-color-scheme/commit/2b39ee9f65633d39155e00883b69cc96e1d5e173) Thanks [@vnphanquang](https://github.com/vnphanquang)! - added support when nested in html itself

## 0.3.0

### Minor Changes

- [`e0c5423`](https://github.com/vnphanquang/postcss-color-scheme/commit/e0c54236c6c953e068a1dd84422f3625adb95b30) Thanks [@vnphanquang](https://github.com/vnphanquang)! - adjustments to adhere to [postcss plugin guidelines](https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md)

### Patch Changes

- [`da6fac2`](https://github.com/vnphanquang/postcss-color-scheme/commit/da6fac2d405e3719937c943a07c691026cd3bd5b) Thanks [@vnphanquang](https://github.com/vnphanquang)! - test case for invalid parameters

## 0.2.2

### Patch Changes

- [`82396af`](https://github.com/vnphanquang/postcss-color-scheme/commit/82396af36921a504685ea4127286f807b687dafe) Thanks [@vnphanquang](https://github.com/vnphanquang)! - add missing `postcss` import, remove "exports" field in package.json

## 0.2.1

### Patch Changes

- [`6dac3e4`](https://github.com/vnphanquang/postcss-color-scheme/commit/6dac3e4834a7dff546ad3a7ff62ce55197eed10f) Thanks [@vnphanquang](https://github.com/vnphanquang)! - remove lib folder from gitignnore

## 0.2.0

### Minor Changes

- [`d5a6ae9`](https://github.com/vnphanquang/postcss-color-scheme/commit/d5a6ae974d1769d3cab72683822bd8ddf4af472e) Thanks [@vnphanquang](https://github.com/vnphanquang)! - provide tailwind plugin as first party support, import at `postcss-color-scheme/tailwind`

### Patch Changes

- [`22b2839`](https://github.com/vnphanquang/postcss-color-scheme/commit/22b283923eb3b44db9c5afe41c6ac8562e38ea1f) Thanks [@vnphanquang](https://github.com/vnphanquang)! - reorganize src -> lib folder

- [`22b2839`](https://github.com/vnphanquang/postcss-color-scheme/commit/22b283923eb3b44db9c5afe41c6ac8562e38ea1f) Thanks [@vnphanquang](https://github.com/vnphanquang)! - include tailwind.js in npm publish

## 0.1.0

### Minor Changes

- [`0f25cd6`](https://github.com/vnphanquang/postcss-color-scheme/commit/0f25cd67d44ba52846d214a25bf724ae57544444) Thanks [@vnphanquang](https://github.com/vnphanquang)! - bootstrap `README.md` with initial documentation

- [`a075074`](https://github.com/vnphanquang/postcss-color-scheme/commit/a0750748ee3befbd842634762205c37caae204ae) Thanks [@vnphanquang](https://github.com/vnphanquang)! - Initial implementation for `@dark` & `@light` custom AtRule
