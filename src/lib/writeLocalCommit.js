const { execGitCommand } = require("./execGitCommand.js");
const chalk = require("./config/chalkConfig.js");

/**
 * Writes a local commit using the provided commit message.
 *
 * @param {string} commitMsg - The commit message.
 * @param {object} readlineInterface - The readline interface for user input.
 * @throws {Error} Throws an error if the local commit process fails.
 */

async function writeLocalCommit(readlineInterface, commitMsg) {
	console.log(chalk.consoleGyB("Writing local commit .. \n"));
	try {

		// Add and commit the changes using the complete commit message
		const result = await execGitCommand(readlineInterface, `add -A && git commit -m ${commitMsg}`);

		if (result) return true;

	} catch (error) {
		console.error(chalk.warningStrong(`writeLocalCommit error: ${error}`));
		return false;
	}
}

module.exports = { writeLocalCommit };
