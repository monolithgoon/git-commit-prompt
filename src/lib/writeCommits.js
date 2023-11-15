const chalk = require("../chalk-messages.js");
const { validateUserInput } = require("./validateUserInput.js");
const { writeLocalCommit } = require("./writeLocalCommit.js");
const { writeRemoteCommit } = require("./writeRemoteCommit.js");
const { forceRemoteCommit } = require("./forceRemoteCommit.js");

/**
 * Writes local and potentially remote commits based on user input.
 *
 * @param {string} commitMsg - The commit message.
 * @param {readline.Interface} rl - The readline interface for user input.
 */

async function writeCommits(commitMsg, rl) {
	try {
		// Make a local commit
		await writeLocalCommit(commitMsg, rl);

		// Ask user to commit to remote origin
		const remoteCommitConfirm = await validateUserInput("Push commit to remote origin? (Y | N)", rl, "ORIGIN");

		// Commit to remote origin
		if (["yes", "y"].includes(remoteCommitConfirm.toLowerCase())) {
			const remoteCommitOk = await writeRemoteCommit(rl);
			if (!remoteCommitOk) {
				await forceRemoteCommit(rl);
			}
		}
	} catch (error) {
		console.error(chalk.fail("An error occurred:"));
		console.error({ error });
		// Optionally, set a non-zero exit code if an error occurs
		process.exitCode = 1;
		rl.close();
	}
	// Set exit code and close readline interface
	process.exitCode = 0;
	rl.close();
}
exports.writeCommits = writeCommits;
