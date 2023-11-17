const chalk = require("./lib/chalkMessages.js");
const { execAsync } = require("./lib/execAsync.js");

/**
 * Commit changes to a remote repository
 * @param {string} remoteRepoName - The name of the remote repository
 * @param {string} remoteBranchName - The name of the remote branch
 * @param {Object} readLineInterface - The readline interface
 * @returns {Promise<boolean>} - Resolves with true if successful, false otherwise
 */
const exeCommitToRemote = async (remoteCommand, remoteRepoName, remoteBranchName, readLineInterface) => {
	try {
		console.log(chalk.consoleGy("Committing to remote .."));

		// Execute the commit command
		const remoteCommitReponse = await execAsync(
			`git ${remoteCommand} ${remoteRepoName} ${remoteBranchName}`,
			readLineInterface
		);

		// Log the commit responses
		console.log(`remoteCommitReponse:`);
		console.log(chalk.consoleG(remoteCommitReponse));
	} catch (error) {
		console.error(chalk.warningStrong(`exeCommitToRemote error: ${error}`));
		throw new Error(`Commit failed`)
	}
};
exports.exeCommitToRemote = exeCommitToRemote;
