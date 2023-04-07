/** @typedef {{ global?: boolean }} ColorSchemeTransformConfig */

/**
 * @param {import('postcss').Node} node
 * @returns {import('postcss').Container}
 */
function findRootOrMediaNode(node) {
  const parent = node.parent;
  if (parent.type === 'root' || (parent.type === 'atrule' && parent.name === 'media')) {
    return parent;
  }
  return findRootOrMediaNode(parent);
}

/**
 * @param {import('postcss').Helpers} helpers
 * @param {import('postcss').AtRule} atRule
 * @param {'dark' | 'light'} theme
 * @param {ColorSchemeTransformConfig} config
 */
function transform(helpers, atRule, theme, config = {}) {
  const param = atRule.params.trim();
  if (param && param !== 'global') {
    throw atRule.error('Invalid parameter, expected "global" or nothing.');
  }
  const global = config.global ?? param === 'global';
  const parent = atRule.parent;
  const container = findRootOrMediaNode(parent);

  let htmlSelectorChunk = `html:not([data-color-scheme="${theme === 'dark' ? 'light' : 'dark'}"])`;
  if (global) {
    htmlSelectorChunk = `:global(${htmlSelectorChunk})`;
  }
  const implicitRule = new helpers.Rule({
    selector: helpers.list
      .comma(parent.selector)
      .map((s) => `${htmlSelectorChunk} ${s}`)
      .join(', '),
    nodes: atRule.nodes,
  })
  const implicitAtRule = new helpers.AtRule({
    source: atRule.source,
    name: 'media',
    params: `(prefers-color-scheme: ${theme})`,
    nodes: [implicitRule],
  });
  const existingAtRule = container.nodes.find((node) => {
    return node.type === implicitAtRule.type && node.name === implicitAtRule.name && node.params === implicitAtRule.params;
  });
  if (existingAtRule) {
    existingAtRule.append(implicitRule);
  } else {
    container.append(implicitAtRule);
  }

  htmlSelectorChunk = `html[data-color-scheme="${theme}"]`;
  if (global) {
    htmlSelectorChunk = `:global(${htmlSelectorChunk})`;
  }
  const explicitRule = new helpers.Rule({
    selector: helpers.list
      .comma(parent.selector)
      .map((s) => `${htmlSelectorChunk} ${s}`)
      .join(', '),
    source: atRule.source,
    nodes: atRule.nodes,
  });
  container.append(explicitRule);

  atRule.remove();
  if (parent.nodes.length === 0) parent.remove();
}

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = function (opts = {}) {
  return {
    postcssPlugin: 'postcss-color-scheme',
    AtRule: {
      'dark': (atRule, helpers) => transform(helpers, atRule, 'dark'),
      'light': (atRule, helpers) => transform(helpers, atRule, 'light'),
    },
  };
};

module.exports.postcss = true;
