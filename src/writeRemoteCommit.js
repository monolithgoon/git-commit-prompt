const chalk = require("./lib/chalkMessages.js");
const { exeCommitToRemote } = require("./exeCommitToRemote.js");
const { askRemoteRepositoryInfo } = require("./askRemoteRepositoryInfo.js");

/**
 * Write changes to a remote repository
 * @param {Object} readLineInterface - The readline interface
 * @returns {Promise<boolean>} - Resolves with true if successful, false otherwise
 */
const writeRemoteCommit = async (readLineInterface) => {
	try {
		// Ask the user for remote repository information
		const { remoteCommand, remoteBranches, remoteRepoName, remoteBranchName } = await askRemoteRepositoryInfo(
			readLineInterface
		);

		// Commit changes to the remote repository
		await exeCommitToRemote(remoteCommand, remoteRepoName, remoteBranchName, readLineInterface);
		return true;
	} catch (error) {
		console.error(chalk.warningStrong(`writeRemoteCommit error: ${error}`));
		return false;
	}
};

exports.writeRemoteCommit = writeRemoteCommit;
