const chalk = require("./lib/chalkMessages.js");
const { execAsync } = require("./lib/execAsync.js");

/**
 * Execute a Git command
 * @param {Object} readLineInterface - The readline interface
 * @param {string} remoteGitCommand - The Git command to interact with the remote repository
 * @param {string} remoteRepoName - The name of the remote repository
 * @param {string} remoteBranchName - The name of the remote branch
 * @returns {Promise<boolean>} - Resolves with true if successful, false otherwise
 */
const exeGitCommand = async (
	readLineInterface,
	remoteGitCommand,
	{ remoteRepoName = "", remoteBranchName = "" } = {}
) => {
	try {
		// Execute the commit command
		const gitCommandResult = await execAsync(
			`git ${remoteGitCommand} ${remoteRepoName} ${remoteBranchName} --quiet`,
			readLineInterface
		);

		// Log the commit responses
		console.info({ gitCommandResult });
		return gitCommandResult;
	} catch (error) {
		console.error(chalk.warningStrong(`exeGitCommand error: ${error}`));
		throw new Error(`Commit failed`);
	}
};
exports.exeGitCommand = exeGitCommand;
