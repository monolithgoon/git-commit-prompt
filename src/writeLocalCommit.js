const chalk = require("./lib/chalkMessages.js");
const { execAsync } = require("./lib/execAsync.js");
const { printCommitMessage } = require("./lib/logging.js");

/**
 * Writes a local commit using the provided commit message.
 *
 * @param {string} commitMsg - The commit message.
 * @param {object} readLineInterface - The readline interface for user input.
 * @throws {Error} Throws an error if the local commit process fails.
 */

async function writeLocalCommit(commitMsg, readLineInterface) {
	console.log(chalk.consoleGy("Writing local commit .."));
	try {
		// Ensure proper quoting around the commit message to handle cases where the commit message contains special characters.
		// const quotedCommitMsg = `"${commitMsg.replace(/"/g, '\\"')}"`;
		// const quotedCommitMsg = commitMsg;
		const escapedComment = commitMsg.replace(/`/g, '\\`');

		// Add and commit the changes using the complete commit message
		const commitResponse = await execAsync(`git add -A && git commit -m ${escapedComment}`, readLineInterface);

		// 
		console.log(chalk.success("Local commit write successful"));

		// Print the commit response
		printCommitMessage(commitResponse);

	} catch (error) {
		console.error(chalk.warningStrong(`writeLocalCommit error: ${error}`));
		// throw new Error("Local commit write failed");
	}
}

module.exports = { writeLocalCommit };
