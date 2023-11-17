const { exeGitCommand } = require("./exeGitCommand.js");
const chalk = require("./lib/chalkMessages.js");
const { execAsync } = require("./lib/execAsync.js");
const { printCommitMessage } = require("./lib/logging.js");

/**
 * Writes a local commit using the provided commit message.
 *
 * @param {string} commitMsg - The commit message.
 * @param {object} readlineInterface - The readline interface for user input.
 * @throws {Error} Throws an error if the local commit process fails.
 */

async function writeLocalCommit(commitMsg, readlineInterface) {
	console.log(chalk.consoleGy("Writing local commit .."));
	try {
		// Ensure proper quoting around the commit message to handle cases where the commit message contains special characters.
		// const quotedCommitMsg = `"${commitMsg.replace(/"/g, '\\"')}"`;
		// const quotedCommitMsg = commitMsg;

		// FIXME -> THIS IS CAUSING THE CMD. LINE TO THROW AN ERROR
		// const escapedComment = commitMsg.replace(/`/g, '\\`');

		const escapedComment = commitMsg;

		// Add and commit the changes using the complete commit message
		// const commitResponse = await execAsync(`git add -A && git commit -m ${escapedComment}`, readlineInterface);

		//
		const commitResponse = await exeGitCommand(readlineInterface, `add -A && git commit -m ${escapedComment}`)

		// 
		console.log(chalk.success("Local commit write successful"));

		// Print the commit response
		printCommitMessage(commitResponse);

	} catch (error) {
		console.error(chalk.warningStrong(`writeLocalCommit error: ${error}`));
	}
}

module.exports = { writeLocalCommit };
