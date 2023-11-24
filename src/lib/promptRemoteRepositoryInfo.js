const { validateRemoteRepoName } = require("./validators/validateRemoteRepoName.js");
const { validateRemoteBranchName } = require("./validators/validateRemoteBranchName.js");
const { validateRemoteGitCommand } = require("./validators/validateRemoteGitCommand.js");

/**
 * Ask the user for remote repository information
 * @param {Object} readLineInterface - The readline interface
 * @returns {Promise<{ remoteGitCommand: string, remoteBranches: string, remoteRepoName: string, remoteBranchName: string }>} - Resolves with remote repository information
 */
const promptRemoteRepositoryInfo = async (readLineInterface) => {
	// Validate remote commit commands
	const remoteGitCommand = await validateRemoteGitCommand(readLineInterface);

	// Validate remote repo name
	const remoteRepoName = await validateRemoteRepoName(readLineInterface);

	// Validate remote repo branch name
	const remoteBranchName = await validateRemoteBranchName(readLineInterface);

	return { remoteGitCommand, remoteRepoName, remoteBranchName };
};

exports.promptRemoteRepositoryInfo = promptRemoteRepositoryInfo;
