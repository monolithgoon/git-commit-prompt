const { execAsync } = require("./execAsync.js");

/**
 * Display available remote repo names
 * @param {Object} readLineInterface - The readline interface
 * @returns {Promise<string>} - Resolves with the available remote branches
 */
const displayRemoteBranches = async (readLineInterface) => {
	return execAsync("git remote -v", readLineInterface);
};
exports.displayRemoteBranches = displayRemoteBranches;
