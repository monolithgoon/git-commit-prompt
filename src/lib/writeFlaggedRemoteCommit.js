const { promptRemoteRepositoryInfo } = require("./promptRemoteRepositoryInfo.js");
const chalk = require("./config/chalkConfig.js");
const { execShellCmd } = require("./utils/execShellCmd.js");

/**
 * Executes a conditional remote commit based on the provided commit flag.
 *
 * @param {Object} readLineInterface - The readline interface for user input.
 * @returns {Promise<void>} - Resolves once the remote commit is executed.
 */
async function writeFlaggedRemoteCommit(readLineInterface, commitFlag) {
	try {
		// Ask the user for remote repository information
		const { remoteGitCommand, remoteRepoName, remoteBranchName } = await promptRemoteRepositoryInfo(readLineInterface);

		// // Ask the user to input a commit flag
		// const commitFlag = await promptRemoteCommitFlag(readLineInterface);

		console.log(chalk.consoleGy("Executing remote commit command .."));

		pushOriginResponse = await execShellCmd(`git ${remoteGitCommand} ${remoteRepoName} ${remoteBranchName} ${commitFlag}`, readLineInterface);
		console.log({ pushOriginResponse });
		return pushOriginResponse;
	} catch (error) {
		console.error(chalk.fail(`Remote commit error: ${error}`));
	}
}

exports.writeFlaggedRemoteCommit = writeFlaggedRemoteCommit;