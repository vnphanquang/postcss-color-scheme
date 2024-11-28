import { invalidParameter, noParameter } from './errors.js';

/**
 * @param {import('postcss').Container | import('postcss').Document} node
 * @returns {import('postcss').Rule | null}
 */
function findFirstNonAtRuleParent(node) {
	const parent = /** @type {import('postcss').Container} */ (node.parent);
	if (!parent) {
		return null;
	}

	if (parent.type === 'rule') {
		return /** @type {import('postcss').Rule} */ (parent);
	}
	return findFirstNonAtRuleParent(parent);
}

/**
 * @param {import('postcss').Helpers} helpers
 * @param {import('postcss').Container} node
 */
function transformFirstChildrenNonAtRule(helpers, node) {
	// transform first child rule selectors
	for (const child of node.nodes ?? []) {
		if (child.type === 'rule') {
			const selectors = [];
			for (const selector of helpers.list.comma(child.selector)) {
				const htmlSelector = getHtmlSelector(selector);
				if (htmlSelector) {
					selectors.push(`&${selector.slice(htmlSelector.length)}`);
				} else {
					selectors.push(`& ${selector}`);
				}
			}
			child.selector = selectors.join(', ');
		} else {
			transformFirstChildrenNonAtRule(helpers, /** @type {import('postcss').Container} */ (child));
		}
	}
}

/**
 * @param {string} selector
 * @returns {string | null}
 */
function getHtmlSelector(selector) {
	return ['html', ':root'].find((prefix) => selector.startsWith(prefix)) ?? null;
}

/**
 * @typedef Options
 * @property {string} name - name of the custom at-rule, default to 'color-scheme'
 * @property {'throw' | 'skip'} onInvalidParameter - behavior when an invalid parameter is found, default to 'throw'
 */

/**
 * @namespace
 * @param {Partial<Options>} [options]
 * @returns {import('postcss').Plugin}
 * @property
 */
function pluginCreator(options = {}) {
	const name = options?.name ?? 'color-scheme';
	let onInvalidParameter = options?.onInvalidParameter;
	if (!onInvalidParameter) {
		onInvalidParameter = name === 'color-scheme' ? 'throw' : 'skip';
	}
	return {
		postcssPlugin: 'postcss-color-scheme',
		AtRule: {
			[name]: function (atRule, helpers) {
				const theme = atRule.params.trim();
				if (!theme) {
					if (onInvalidParameter === 'throw') {
						throw atRule.error(noParameter());
					}
					return;
				}

				if (!['light', 'dark'].includes(theme)) {
					if (onInvalidParameter === 'throw') {
						throw atRule.error(invalidParameter(theme));
					}
					return;
				}
				const complement = theme === 'dark' ? 'light' : 'dark';

				const firstNonAtRuleParent = findFirstNonAtRuleParent(atRule);

				const isAtRoot = !firstNonAtRuleParent;
				const isNestedInHtml =
					firstNonAtRuleParent && !!getHtmlSelector(firstNonAtRuleParent.selector);

				let implicitSelector = `:not([data-color-scheme="${complement}"])`;
				let explicitSelector = `[data-color-scheme="${theme}"]`;
				if (isNestedInHtml) {
					implicitSelector = `&${implicitSelector}`;
					explicitSelector = `&${explicitSelector}`;
				} else if (!isAtRoot) {
					implicitSelector = `html${implicitSelector} &`;
					explicitSelector = `html${explicitSelector} &`;
				} else {
					implicitSelector = `html${implicitSelector}`;
					explicitSelector = `html${explicitSelector}`;
					transformFirstChildrenNonAtRule(helpers, atRule);
				}

				const implicitRule = new helpers.Rule({
					selector: implicitSelector,
					nodes: atRule.nodes,
				});
				const implicitAtRule = new helpers.AtRule({
					source: atRule.source,
					name: 'media',
					params: `(prefers-color-scheme: ${theme})`,
					nodes: [implicitRule],
				});

				const explicitRule = new helpers.Rule({
					selector: explicitSelector,
					source: atRule.source,
					nodes: atRule.nodes,
				});

				atRule.replaceWith(implicitAtRule, explicitRule);
			},
		},
	};
}

/**
 * @memberof pluginCreator
 */
pluginCreator.postcss = true;

export default pluginCreator;
