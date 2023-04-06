const plugin = require('tailwindcss/plugin');

module.exports = plugin(
  function({ addVariant }) {
    // dark
    addVariant('dark', [
      ':merge(html[data-color-scheme="dark"]) &',
      ({ container }) => {
        const originalRule = container.nodes[0];
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
      },
    ]);

    // light
    addVariant('light', [
      ':merge(html[data-color-scheme="light"]) &',
      ({ container }) => {
        const originalRule = container.nodes[0];
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
      },
    ]);
  }
);
