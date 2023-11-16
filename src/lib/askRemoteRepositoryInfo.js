const { displayRemoteBranches } = require("./displayRemoteBranches.js");
const { validateRemoteRepoName } = require("./validateRemoteRepoName.js");
const { validateRemoteBranchName } = require("./validateRemoteBranchName.js");

/**
 * Ask the user for remote repository information
 * @param {Object} readLineInterface - The readline interface
 * @returns {Promise<{ remoteBranches: string, remoteRepoName: string, remoteBranchName: string }>} - Resolves with remote repository information
 */
const askRemoteRepositoryInfo = async (readLineInterface) => {
	// Display available remote repo names
	const remoteBranches = await displayRemoteBranches(readLineInterface);
	console.log({ remoteBranches });

	// Validate remote repo name
	const remoteRepoName = await validateRemoteRepoName(readLineInterface);

	// Validate remote repo branch name
	const remoteBranchName = await validateRemoteBranchName(readLineInterface);

	return { remoteBranches, remoteRepoName, remoteBranchName };
};
exports.askRemoteRepositoryInfo = askRemoteRepositoryInfo;
