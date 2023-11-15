const chalk = require("./lib/chalk-messages.js");
const { validateUserInput } = require("./validateUserInput.js");

// Todo
// function promptCommitDest(promptQuestion, options, rl) {

async function promptCommitDest(promptQuestion, destination, rl) {
	try {
		// Ask user to commit to remote origin
		const remoteCommitConfirm = await validateUserInput(promptQuestion, rl, destination);

		// Commit to remote origin
		if (["yes", "y"].includes(remoteCommitConfirm.toLowerCase())) {
			return true;
		}
	} catch (error) {
		console.error(chalk.warningStrong(`promptCommitDestErr: ${error}`));
		// Set a non-zero exit code if an error occurs
		process.exitCode = 1;
	} finally {
		rl.close();
	}

	// Set exit code
	process.exitCode = 0;
}

exports.promptCommitDest = promptCommitDest;
