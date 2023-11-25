const signale = require("signale");
const { execShellCommand } = require("../lib/utils/execShellCommand.js");

function isBenignErrChk(response) {
	// Log verbose reponse
	// console.log(response);

	// Serious error =>
	// Return false if there is no response from remote
	if (response.signal === null) {
		signale.error(`\n ${response}`);
		return false;
	}

	// Process stdout to extract relevant information (e.g., branch updates)
	const branchUpdateRegex = /To (.+?)\s+(.+?)\s+(.+) -> (.+)/;
	const isBenignResponse = response.match(branchUpdateRegex);

	if (isBenignResponse) {
		const [, remote, oldCommit, newCommit, branch] = isBenignResponse;
		console.log(`Branch '${branch}' updated from ${oldCommit} to ${newCommit} on remote '${remote}'.`);
		return true;
	} else {
		return false;
	}
}

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
	let commitOutput;
	try {
		// Execute the commit command
		commitOutput = await execShellCommand(
			`git ${remoteGitCommand} ${remoteRepoName} ${remoteBranchName}`,
			readLineInterface
		);

		// Log the commit responses
		signale.success(`\n ${commitOutput}`);

		return true;
	} catch (error) {
		/**
		 * This code checks if isBenignErrChk(error) is falsy.
		 * If it is, meaning there was an issue with the command execution, it throws an error with a descriptive message.
		 * If isBenignErrChk(error) is truthy, indicating a successful command execution, it does nothing and continues with the rest of the code.
		 */
		if (!isBenignErrChk(error)) {
			throw new Error(`exeGitCommand error: ${error}`);
		} else {
			return true;
		}
	}
};
exports.execGitCommand = execGitCommand;
