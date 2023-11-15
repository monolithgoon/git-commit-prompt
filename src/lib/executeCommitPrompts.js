const readline = require("readline");
const chalk = require("../chalk-messages.js");
const { validateUserInput } = require("./validateUserInput.js");
const { displayCommitTypes } = require("./lib.js");
const { writeCommits } = require("./writeCommits.js");

/**
 * Prompt the user for input unless the choice is "NONE".
 *
 * @param {string} choice - The commit choice, e.g., "TYPE", "DOMAIN", "MESSAGE", or "NONE".
 * @param {readline.Interface} rl - The readline interface for reading user input.
 * @returns {Promise<?string>} - A Promise that resolves to the user input or undefined if the choice is "NONE".
 */
const getUserCommitCategoryInput = async (choice, rl) => {
	return choice !== "NONE" ? await validateUserInput(`Enter a commit ${choice}:`, rl, choice) : undefined;
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
	let commitType, commitDomain, commitMsg, completeCommitMsg, commitAmendChoice;

	try {
		// Prompt the user for commit information until they confirm their message
		while (true) {
			// Check if the user has requested to change a specific part of the commit message
			switch (commitAmendChoice?.toUpperCase()) {
				case "TYPE":
					commitType = await getUserCommitCategoryInput("TYPE", rl);
					break;

				case "DOMAIN":
					commitDomain = await getUserCommitCategoryInput("DOMAIN", rl);
					break;

				case "MESSAGE":
					commitMsg = await getUserCommitCategoryInput("MESSAGE", rl);
					break;

				case "NONE":
					break;

				default:
					// Prompt the user for the full commit message if no amendment is requested
					commitType = await getUserCommitCategoryInput("TYPE", rl);
					commitDomain = await getUserCommitCategoryInput("DOMAIN", rl);
					commitMsg = await getUserCommitCategoryInput("MESSAGE", rl);
					break;
			}

			// Combine the commit information into a single message
			completeCommitMsg = `"${commitType} (${commitDomain}) - ${commitMsg}"`;

			console.log({ completeCommitMsg });

			// Confirm the commit message with the user
			let localCommitConfirm = await validateUserInput(
				"Confirm commit message is OK? ( Y / N / QUIT):",
				rl,
				"CONFIRM"
			);

			if (["yes", "y"].includes(localCommitConfirm.toLowerCase())) {
				// Break out of while loop
				break;
			} else if (["quit", "q", "end"].includes(localCommitConfirm.toLowerCase())) {
				// Quit cmd line program
				process.exitCode = 0;
			} else {
				// If the user doesn't confirm their message, allow them to amend it
				console.log({ commitType });
				console.log({ commitDomain });
				console.log({ commitMsg });
				commitAmendChoice = await validateUserInput(
					`Select which prompt to amend ( "TYPE", "DOMAIN", "MESSAGE", "NONE"):`,
					rl,
					"AMEND"
				);
			}
		}

		// Write local and remote commits
		await writeCommits(completeCommitMsg, rl);

	} catch (error) {
		console.error(chalk.fail(`executeCommitPrompts fn. error`));
		console.error(chalk.consoleYlow(error.message));
		process.exitCode = 1;
	} finally {
		// Close the readline interface and exit the process
		process.exitCode = 0;
		rl.close();
	}
}

module.exports = { executeCommitPrompts };
