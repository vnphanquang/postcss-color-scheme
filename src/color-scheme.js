const postcss = require('postcss');

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
 * @param {import('postcss').AtRule} atRule
 * @param {'dark' | 'light'} theme
 * @param {ColorSchemeTransformConfig} config
 */
function transform(atRule, theme, config = {}) {
  try {
    const { global } = {
      global: atRule.params.trim() === 'global',
      ...config,
    };
    const parent = atRule.parent;
    const container = findRootOrMediaNode(parent);

    let htmlSelectorChunk = `html:not([data-color-scheme="${theme === 'dark' ? 'light' : 'dark'}"])`;
    if (global) {
      htmlSelectorChunk = `:global(${htmlSelectorChunk})`;
    }
    const implicitRule = new postcss.Rule({
      selector: postcss.list
        .comma(parent.selector)
        .map((s) => `${htmlSelectorChunk} ${s}`)
        .join(', '),
      nodes: atRule.nodes,
    })
    const implicitAtRule = new postcss.AtRule({
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
    const explicitRule = new postcss.Rule({
      selector: postcss.list
        .comma(parent.selector)
        .map((s) => `${htmlSelectorChunk} ${s}`)
        .join(', '),
      source: atRule.source,
      nodes: atRule.nodes,
    });
    container.append(explicitRule);

    atRule.remove();
    if (parent.nodes.length === 0) parent.remove();
  } catch (error) {
    console.error(error);
  }
}

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = function (opts = {}) {
  return {
    postcssPlugin: 'postcss-color-scheme',
    AtRule: {
      'dark': (atRule) => transform(atRule, 'dark'),
      'light': (atRule) => transform(atRule, 'light'),
    },
  };
};

module.exports.postcss = true;
