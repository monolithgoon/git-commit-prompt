const chalk = require("./chalkMessages.js");
const { execAsync } = require("./execAsync.js");

/**
 * Commit changes to a remote repository
 * @param {string} remoteRepoName - The name of the remote repository
 * @param {string} remoteBranchName - The name of the remote branch
 * @param {Object} readLineInterface - The readline interface
 * @returns {Promise<boolean>} - Resolves with true if successful, false otherwise
 */
const commitToRemote = async (remoteRepoName, remoteBranchName, readLineInterface) => {
	try {
		console.log(chalk.consoleGy("Committing to remote .."));

		// Execute the commit command
		const pushRemoteCommitResponse = await execAsync(
			`git push ${remoteRepoName} ${remoteBranchName}`,
			readLineInterface
		);

		// Log the commit responses
		console.log(`pushRemoteCommitResponse:`);
		console.log(chalk.consoleG(pushRemoteCommitResponse));
	} catch (error) {
		console.error(chalk.warningStrong(`writeRemoteCommit error: ${error}`));
	}
};
exports.commitToRemote = commitToRemote;
