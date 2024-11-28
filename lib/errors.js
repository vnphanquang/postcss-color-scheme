export const noParameter = () => 'No parameter is provided, expected "light" or "dark"';
/**
 * @param {string} param
 */
export const invalidParameter = (param) =>
	`Invalid parameter, expected "light" or "dark", got ${param}`;
