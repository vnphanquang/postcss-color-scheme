import postcss from 'postcss';
import plugin from 'tailwindcss/plugin.js';

/**
 * Relies on the api object passed to functions in addVariant,
 * see https://github.com/tailwindlabs/tailwindcss/blob/f57678e29ba7a9b7b2c1c5862bc9d4fd5b03d240/src/lib/setupContextUtils.js#L543
 */

export default plugin(
  function({ addVariant }) {
    // dark
    addVariant('dark', [
      () => ':merge(html[data-color-scheme="dark"]) &',
      /** @type {any} */(
        /**
         *
         * @param {{ container: import('postcss').Container }} param0
         */
        ({ container }) => {
          const originalRule = /** @type {import('postcss').Rule} */(container.nodes[0]);
          const mediaRule = postcss.atRule({
            name: 'media',
            params: '(prefers-color-scheme: dark)',
            nodes: [
              postcss.rule({
                selector: `html:not([data-color-scheme="light"]) ${originalRule.selector}`,
                nodes: originalRule.nodes,
              }),
            ],
          });
          container.removeAll();
          container.append(mediaRule);
        }
      ),
    ]);

    // light
    addVariant('light', [
      () => ':merge(html[data-color-scheme="light"]) &',
      /** @type {any} */(
        /**
         *
         * @param {{ container: import('postcss').Container }} param0
         */
        ({ container }) => {
          const originalRule = /** @type {import('postcss').Rule} */(container.nodes[0]);
          const mediaRule = postcss.atRule({
            source: originalRule.source,
            name: 'media',
            params: '(prefers-color-scheme: light)',
            nodes: [
              postcss.rule({
                selector: `html:not([data-color-scheme="dark"]) ${originalRule.selector}`,
                nodes: originalRule.nodes,
              }),
            ],
          });
          container.removeAll();
          container.append(mediaRule);
        }
      ),
    ]);
  },
  {
    // negate default Tailwind dark variant declaration
    darkMode: /** @type {any} */(''),
  },
);
