const { readlineQuestionAsync } = require("../utils/readlineQuestionAsync.js");

/**
 * Validate the remote branch name
 * @param {Object} readLineInterface - The readline interface
 * @returns {Promise<string>} - Resolves with the validated remote branch name
 */
const validateRemoteBranchName = async (readLineInterface) => {
	return readlineQuestionAsync(`Enter the name of the remote branch (or leave blank):`, readLineInterface);
};
exports.validateRemoteBranchName = validateRemoteBranchName;
