---
'postcss-color-scheme': major
---

[BREAKING] drop `:global` variant to avoid ambiguity. User may use `:global` manually. In Svelte 5, for example, you can now declare a `:global` style block, e.g. `:global { .class { @color-scheme dark { /* ... */ } } }`;
