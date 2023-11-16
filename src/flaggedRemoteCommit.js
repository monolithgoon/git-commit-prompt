const { askCommitFlag } = require("./askCommitFlag.js");
const { askRemoteRepositoryInfo } = require("./askRemoteRepositoryInfo.js");
const chalk = require("./lib/chalkMessages.js");
const { execAsync } = require("./lib/execAsync.js");

/**
 * Executes a conditional remote commit based on the provided commit flag.
 *
 * @param {Object} readLineInterface - The readline interface for user input.
 * @returns {Promise<void>} - Resolves once the remote commit is executed.
 */
async function flaggedRemoteCommit(readLineInterface) {
	try {
		// Ask the user for remote repository information
		const { remoteBranches, remoteRepoName, remoteBranchName } = await askRemoteRepositoryInfo(readLineInterface);

		// Ask the user to input a commit flag
		const commitFlag = await askCommitFlag(readLineInterface);

		console.log(chalk.consoleGy("Executing remote commit command .."));

		pushOriginResponse = await execAsync(`git push ${remoteRepoName} ${remoteBranchName} ${commitFlag}`, readLineInterface);
		console.log({ pushOriginResponse });
	} catch (error) {
		console.error(chalk.fail(`Remote commit error: ${error}`));
	}
}

exports.flaggedRemoteCommit = flaggedRemoteCommit;