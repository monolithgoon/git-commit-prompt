const chalk = require("./chalk-messages.js");
const { execAsync } = require("./execAsync.js");
const { printCommitMessage } = require("./lib.js");

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
		const quotedCommitMsg = commitMsg;

		// Add and commit the changes using the complete commit message
		const commitResponse = await execAsync(`git add -A && git commit -m ${quotedCommitMsg}`, readLineInterface);

		// 
		console.log(chalk.interaction("LOCAL COMMIT WRITE SUCCESSFUL"));

		// Print the commit response
		printCommitMessage(commitResponse);

	} catch (error) {
		// console.error(chalk.warningBright(`Local commit error: ${error}`));
		console.error(chalk.warningStrong(error));
		throw new Error("Local commit write failed");
	}
}

module.exports = { writeLocalCommit };
