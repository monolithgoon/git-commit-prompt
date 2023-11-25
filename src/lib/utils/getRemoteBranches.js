const { execShellCommand } = require("./execShellCommand.js");

/**
 * Display available remote repo names
 * @param {Object} readLineInterface - The readline interface
 * @returns {Promise<string>} - Resolves with the available remote branches
 */
const getRemoteBranches = async (readLineInterface) => {
	return execShellCommand("git branch -r", readLineInterface);
};
exports.getRemoteBranches = getRemoteBranches;
