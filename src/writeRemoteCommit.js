const chalk = require("./lib/chalkMessages.js");
const { exeGitCommand } = require("./exeGitCommand.js");
const { askRemoteRepositoryInfo } = require("./askRemoteRepositoryInfo.js");

/**
 * Write changes to a remote repository
 * @param {Object} readlineInterface - The readline interface
 * @returns {Promise<boolean>} - Resolves with true if successful, false otherwise
 */
const writeRemoteCommit = async (readlineInterface) => {
	try {
		// Ask the user for remote repository information
		const { remoteGitCommand, remoteBranches, remoteRepoName, remoteBranchName } = await askRemoteRepositoryInfo(
			readlineInterface
		);

		// Alert user
		console.log(chalk.consoleGy("Committing to remote .."));

		// Commit changes to the remote repository
		// await exeGitCommand(readlineInterface, remoteGitCommand, remoteRepoName, remoteBranchName);
		await exeGitCommand(readlineInterface, remoteGitCommand, {
			remoteRepoName: remoteRepoName,
			remoteBranchName: remoteBranchName,
		});
		return true;
	} catch (error) {
		console.error(chalk.warningStrong(`writeRemoteCommit error: ${error}`));
		return false;
	}
};

exports.writeRemoteCommit = writeRemoteCommit;
