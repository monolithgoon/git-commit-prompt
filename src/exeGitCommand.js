const chalk = require("./lib/chalkMessages.js");
const { execAsync } = require("./lib/execAsync.js");

/**
 * Execute a Git command
 * @param {string} remoteRepoName - The name of the remote repository
 * @param {string} remoteBranchName - The name of the remote branch
 * @param {Object} readLineInterface - The readline interface
 * @returns {Promise<boolean>} - Resolves with true if successful, false otherwise
 */
const exeGitCommand = async (remoteCommand, remoteRepoName, remoteBranchName, readLineInterface) => {
	try {

		// Execute the commit command
		const gitCommandResult = await execAsync(
			`git ${remoteCommand} ${remoteRepoName} ${remoteBranchName}`,
			readLineInterface
		);

		// Log the commit responses
		console.log(`gitCommandResult:`);
		console.log(chalk.consoleG(gitCommandResult));
	} catch (error) {
		console.error(chalk.warningStrong(`exeGitCommand error: ${error}`));
		throw new Error(`Commit failed`)
	}
};
exports.exeGitCommand = exeGitCommand;
