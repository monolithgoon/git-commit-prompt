const { execShellCmd } = require("./execShellCmd.js");

/**
 * Display available remote repo names
 * @param {Object} readLineInterface - The readline interface
 * @returns {Promise<string>} - Resolves with the available remote branches
 */
const getRemoteBranches = async (readLineInterface) => {
	return execShellCmd("git branch -r", readLineInterface);
};
exports.getRemoteBranches = getRemoteBranches;
