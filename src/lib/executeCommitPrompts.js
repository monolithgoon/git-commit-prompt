const readline = require("readline");
const chalk = require("../chalk-messages.js");
const { promptUserInput } = require("./promptUserInput.js");
const { writeLocalCommit } = require("./writeLocalCommit.js");
const { writeRemoteCommit } = require("./writeRemoteCommit.js");
const { forceRemoteCommit } = require("./forceRemoteCommit.js");
const { displayCommitTypes } = require("./lib.js");

/**
 * Asynchronously prompts the user for input based on the specified choice.
 *
 * @param {string} choice - The commit choice, e.g., "TYPE", "DOMAIN", "MESSAGE", or "NONE".
 * @param {readline.Interface} rl - The readline interface for reading user input.
 * @returns {Promise<?string>} - A Promise that resolves to the user input or undefined if the choice is "NONE".
 */
const getUserInput = async (choice, rl) => {
  /**
   * Prompt the user for input unless the choice is "NONE".
   *
   * @param {string} promptMessage - The prompt message to display to the user.
   * @param {readline.Interface} rl - The readline interface for reading user input.
   * @param {string} choice - The commit choice.
   * @returns {Promise<?string>} - A Promise that resolves to the user input or undefined if the choice is "NONE".
   */
  return choice !== "NONE" ? await promptUserInput(`Enter a commit ${choice}:`, rl, choice) : undefined;
};

/**
 * @description Prompts the user for a commit message and number of log lines, then
 * executes a git commit and push to origin.
 * @function executeCommitPrompts
 */
async function executeCommitPrompts() {
	// Create a readline interface to prompt the user for input
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	//
	displayCommitTypes();

	// Declare variables to store commit information
	let commitType,
		commitDomain,
		commitMsg,
		completeCommitMsg,
		commitConfirm,
		commitAmendChoice,
		askRemoteCommit,
		remoteCommitOk;

	try {
		// Prompt the user for commit information until they confirm their message
		while (true) {
			// Check if the user has requested to change a specific part of the commit message
			switch (commitAmendChoice?.toUpperCase()) {
				case "TYPE":
					commitType = await getUserInput("TYPE", rl);
					break;

				case "DOMAIN":
					commitDomain = await getUserInput("DOMAIN", rl);
					break;

				case "MESSAGE":
					commitMsg = await getUserInput("MESSAGE", rl);
					break;

				case "NONE":
					break;

				default:
					// Prompt the user for the full commit message if no amendment is requested
					commitType = await getUserInput("TYPE", rl);
					commitDomain = await getUserInput("DOMAIN", rl);
					commitMsg = await getUserInput("MESSAGE", rl);
					break;
			}

			// Combine the commit information into a single message
			completeCommitMsg = `"${commitType} (${commitDomain}) - ${commitMsg}"`;

			console.log({ completeCommitMsg });

			// Confirm the commit message with the user
			commitConfirm = await promptUserInput("Confirm commit message is OK? ( Y / N / QUIT):", rl, "CONFIRM");

			if (["yes", "y"].includes(commitConfirm.toLowerCase())) {
				// Break out of while loop
				break;
			} else if (["quit", "q", "end"].includes(commitConfirm.toLowerCase())) {
				// Quit cmd line program
				process.exitCode = 0;
			} else {
				// If the user doesn't confirm their message, allow them to amend it
				console.log({ commitType });
				console.log({ commitDomain });
				console.log({ commitMsg });
				commitAmendChoice = await promptUserInput(
					`Select which prompt to amend ( "TYPE", "DOMAIN", "MESSAGE", "NONE"):`,
					rl,
					"AMEND"
				);
			}
		}

		// Make a local commit
		await writeLocalCommit(completeCommitMsg, rl);

		// Prompt user to commit to origin / master
		askRemoteCommit = await promptUserInput("Push commit to remote origin? ( Y / N )", rl, "ORIGIN");

		remoteCommitOk = writeRemoteCommit(rl);

		if (!remoteCommitOk) forceRemoteCommit(rl);

		process.exitCode = 0;
	} catch (error) {
		console.error(chalk.fail(`executeCommitPrompts error`));
		console.error(chalk.consoleYlow(error.message));
		process.exitCode = 1;
	} finally {
		// Close the readline interface and exit the process
		rl.close();
	}
}

module.exports = { executeCommitPrompts };
