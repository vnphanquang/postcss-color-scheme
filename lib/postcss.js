/** @typedef {{ global?: boolean }} ColorSchemeTransformConfig */

/**
 * @param {import('postcss').Container | import('postcss').Document} node
 * @returns {import('postcss').Container | undefined}
 */
function findRootOrMediaNode(node) {
  const parent = /** @type {import('postcss').Container} */(node.parent);
  if (!parent) {
    return undefined;
  }

  if (parent.type === 'root' || (parent.type === 'atrule' && /** @type {import('postcss').AtRule} */(parent).name === 'media')) {
    return parent;
  }
  return findRootOrMediaNode(parent);
}

const HTML_SELECTOR_PREFIXES = ['html', ':root'];
const GLOBAL_HTML_SELECTOR_PREFIXES = HTML_SELECTOR_PREFIXES.map((selector) => `:global(${selector}`);
/**
 * @param {import('postcss').Helpers} helpers
 * @param {import('postcss').Container} parent
 * @param {string} additionalChunk
 * @param {boolean} global
 * @returns {string}
 */
function constructSelector(helpers, parent, additionalChunk, global) {
  const parentSelectors = helpers.list.comma(/** @type {import('postcss').Rule} */(parent).selector);
  /** @type {string[]} */
  let selectors = [];
  for (const selector of parentSelectors) {
    let joinedSelector = '';

    for (const prefix of GLOBAL_HTML_SELECTOR_PREFIXES) {
      if (selector.startsWith(prefix)) {
        joinedSelector = `${prefix}${additionalChunk}${selector.substring(prefix.length)}`;
        break;
      }
    }

    for (const prefix of HTML_SELECTOR_PREFIXES) {
      if (selector.startsWith(prefix)) {
        joinedSelector = `${prefix}${additionalChunk}${selector.substring(prefix.length)}`;
        if (global) joinedSelector = `:global(${joinedSelector})`;
        break;
      }
    }

    if (!joinedSelector) {
      let chunkToAdd = `html${additionalChunk}`;
      if (global) chunkToAdd = `:global(${chunkToAdd})`;
      joinedSelector = `${chunkToAdd} ${selector}`;
    }
    selectors.push(joinedSelector);
  }
  return selectors.join(', ');
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
  const parent = /** @type {import('postcss').Container} */(atRule.parent);
  const container = findRootOrMediaNode(parent);
  if (!container) {
    throw atRule.error(`Expect @${theme} to be nested in a selector.`);
  }

  let selectorColorSchemeChunk = `:not([data-color-scheme="${theme === 'dark' ? 'light' : 'dark'}"])`;
  const implicitRule = new helpers.Rule({
    selector: constructSelector(helpers, parent, selectorColorSchemeChunk, global),
    nodes: atRule.nodes,
  });
  const implicitAtRule = new helpers.AtRule({
    source: atRule.source,
    name: 'media',
    params: `(prefers-color-scheme: ${theme})`,
    nodes: [implicitRule],
  });
  const existingAtRule = /** @type {import('postcss').Rule} */(container.nodes.find((node) => {
    return node.type === implicitAtRule.type && node.name === implicitAtRule.name && node.params === implicitAtRule.params;
  }));
  if (existingAtRule) {
    existingAtRule.append(implicitRule);
  } else {
    container.append(implicitAtRule);
  }

  selectorColorSchemeChunk = `[data-color-scheme="${theme}"]`;
  const explicitRule = new helpers.Rule({
    selector: constructSelector(helpers, parent, selectorColorSchemeChunk, global),
    source: atRule.source,
    nodes: atRule.nodes,
  });
  container.append(explicitRule);

  atRule.remove();
  if (parent.nodes.length === 0) parent.remove();
}

/**
 * @namespace
 * @param {{}} _opts
 * @returns {import('postcss').Plugin}
 * @property
 */
function pluginCreator(_opts = {}) {
  return {
    postcssPlugin: 'postcss-color-scheme',
    AtRule: {
      'dark': (atRule, helpers) => transform(helpers, atRule, 'dark'),
      'light': (atRule, helpers) => transform(helpers, atRule, 'light'),
    },
  };
}

/**
 * @memberof pluginCreator
 */
pluginCreator.postcss = true;

module.exports = pluginCreator;
