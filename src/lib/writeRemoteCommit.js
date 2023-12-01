const chalk = require("./config/chalkConfig.js");
const { execGitCommand } = require("./execGitCommand.js");
const { promptRemoteRepositoryInfo } = require("./promptRemoteRepositoryInfo.js");

/**
 * Write changes to a remote repository
 * @param {Object} readlineInterface - The readline interface
 * @returns {Promise<boolean>} - Resolves with true if successful, false otherwise
 */
const writeRemoteCommit = async (readlineInterface) => {
	try {
		// Ask the user for remote repository information
		const { remoteGitCommand, remoteRepoName, remoteBranchName } = await promptRemoteRepositoryInfo(
			readlineInterface
		);

		// Alert user
		console.log(chalk.consoleGyB("Committing to remote .."));

		// Commit changes to the remote repository
		const remoteResponse = await execGitCommand(readlineInterface, remoteGitCommand, {
			remoteRepoName: remoteRepoName,
			remoteBranchName: remoteBranchName,
		});

		console.log({remoteResponse})
		
		return true;
	} catch (error) {
		console.error(chalk.warningStrong(`writeRemoteCommit error: ${error}`));
		return false;
	}
};

exports.writeRemoteCommit = writeRemoteCommit;
