const { validateUserInput } = require("./lib/validators/validateUserInput");

/**
 * Ask the user to input a commit flag
 * @param {Object} readLineInterface - The readline interface
 * @returns {Promise<string>} - Resolves with the user's input for the commit flag
 */
const askCommitFlag = async (readLineInterface) => {
	return validateUserInput("Enter the commit flag (e.g., -m):", readLineInterface);
};
exports.askCommitFlag = askCommitFlag;
