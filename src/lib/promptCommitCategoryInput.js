const { validateUserInput } = require("./validators/validateUserInput.js");

/**
 * Prompt the user for input unless the categoryFlag is "NONE".
 *
 * @param {string} categoryFlag - The commit categoryFlag, e.g., "TYPE", "SCOPE", "MESSAGE", or "NONE".
 * @param {readline.Interface} rl - The readline interface for reading user input.
 * @returns {Promise<?string>} - A Promise that resolves to the user input or undefined if the categoryFlag is "NONE".
 */
const promptCommitCategoryInput = async (categoryFlag, rl) => {
	return categoryFlag !== "NONE"
		? await validateUserInput(`Enter a commit ${categoryFlag} >`, rl, categoryFlag)
		: undefined;
};

exports.promptCommitCategoryInput = promptCommitCategoryInput;
