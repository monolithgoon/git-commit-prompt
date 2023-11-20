const { exeGitCommand } = require("./exeGitCommand.js");
const chalk = require("./lib/chalkMessages.js");

/**
 * Writes a local commit using the provided commit message.
 *
 * @param {string} commitMsg - The commit message.
 * @param {object} readlineInterface - The readline interface for user input.
 * @throws {Error} Throws an error if the local commit process fails.
 */

async function writeLocalCommit(readlineInterface, commitMsg) {
	console.log(chalk.consoleGy("Writing local commit .."));
	try {
		// Ensure proper quoting around the commit message to handle cases where the commit message contains special characters.
		// const quotedCommitMsg = `"${commitMsg.replace(/"/g, '\\"')}"`;
		// const quotedCommitMsg = commitMsg;

		// FIXME -> THIS IS CAUSING THE CMD. LINE TO THROW AN ERROR
		// const escapedComment = commitMsg.replace(/`/g, '\\`');

		const escapedComment = commitMsg;

		// Add and commit the changes using the complete commit message
		await exeGitCommand(readlineInterface, `add -A && git commit -m ${escapedComment}`);

		//
		console.log(chalk.consoleG("Local commit write successful"));

	} catch (error) {
		console.error(chalk.warningStrong(`writeLocalCommit error: ${error}`));
	}
}

module.exports = { writeLocalCommit };
