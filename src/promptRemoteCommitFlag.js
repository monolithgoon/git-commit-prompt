const { readlineQuestionAsync } = require("./lib/utils/readlineQuestionAsync");

/**
 * Ask the user to input a commit flag
 * @param {Object} readLineInterface - The readline interface
 * @returns {Promise<string>} - Resolves with the user's input for the commit flag
 */
const promptRemoteCommitFlag = async (readLineInterface) => {
	return readlineQuestionAsync("Enter a remote commit --flag (e.g., -m):", readLineInterface);
};
exports.promptRemoteCommitFlag = promptRemoteCommitFlag;
