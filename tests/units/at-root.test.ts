import { test } from '../context';

test('declared at root', async ({ expect, utils: { compile, css } }) => {
	const copmiled = await compile(css` @color-scheme light {--color: white;} `);
	expect(copmiled).toMatchInlineSnapshot(`
		"@media (prefers-color-scheme: light) {
		html:not([data-color-scheme="dark"]) {--color: white
		}
		}
		html[data-color-scheme="light"] {--color: white
		}"
	`);
});

test('declared at root, has child html rule', async ({ expect, utils: { compile, css } }) => {
	const copmiled = await compile(css`
		@color-scheme light {
			html {
				--color: white;
			}
		}
	`);
	expect(copmiled).toMatchInlineSnapshot(`
		"@media (prefers-color-scheme: light) {
			html:not([data-color-scheme="dark"]) {
			& {
				--color: white;
			}
			}
		}
		html[data-color-scheme="light"] {
			& {
				--color: white;
			}
		}"
	`);
});

test('declared at root, has child :root rule', async ({ expect, utils: { compile, css } }) => {
	const copmiled = await compile(css`
		@color-scheme light {
			:root {
				--color: white;
			}
		}
	`);
	expect(copmiled).toMatchInlineSnapshot(`
		"@media (prefers-color-scheme: light) {
			html:not([data-color-scheme="dark"]) {
			& {
				--color: white;
			}
			}
		}
		html[data-color-scheme="light"] {
			& {
				--color: white;
			}
		}"
	`);
});

test('decalred at root, has child at-rule', async ({ expect, utils: { compile, css } }) => {
	const copmiled = await compile(css`
		@color-scheme light {@media (width >= 48rem) {--color: white;}}
	`);
	expect(copmiled).toMatchInlineSnapshot(`"@media (prefers-color-scheme: light) {html:not([data-color-scheme="dark"]) {@media (width >= 48rem) {--color: white;}}}html[data-color-scheme="light"] {@media (width >= 48rem) {--color: white;}}"`);
});

test('decalred at root, has child non-at-rule', async ({ expect, utils: { compile, css } }) => {
	const copmiled = await compile(css`
		@color-scheme light {
			.class,
			#id,
			tag {
				--color: white;
			}
		}
	`);
	expect(copmiled).toMatchInlineSnapshot(`
		"@media (prefers-color-scheme: light) {
			html:not([data-color-scheme="dark"]) {
			& .class, & #id, & tag {
				--color: white;
			}
			}
		}
		html[data-color-scheme="light"] {
			& .class, & #id, & tag {
				--color: white;
			}
		}"
	`);
});
