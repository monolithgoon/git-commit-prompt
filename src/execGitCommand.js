const chalk = require("./lib/config/chalkConfig.js");
const { execShellCmd } = require("./lib/utils/execShellCmd.js");

/**
 * Execute a Git command
 * @param {Object} readLineInterface - The readline interface
 * @param {string} remoteGitCommand - The Git command to interact with the remote repository
 * @param {string} remoteRepoName - The name of the remote repository
 * @param {string} remoteBranchName - The name of the remote branch
 * @returns {Promise<boolean>} - Resolves with true if successful, false otherwise
 */
const execGitCommand = async (
	readLineInterface,
	remoteGitCommand,
	{ remoteRepoName = "", remoteBranchName = "" } = {}
) => {
	try {
		// Execute the commit command
		const output = await execShellCmd(
			`git ${remoteGitCommand} ${remoteRepoName} ${remoteBranchName}`,
			readLineInterface
		);

		// Log the commit responses
		console.info({ output });

		return output;
	} catch (error) {
		console.error(chalk.warningStrong(`execGitCommand error: ${error}`));
		throw new Error(`Commit failed`);
	}
};
exports.execGitCommand = execGitCommand;
