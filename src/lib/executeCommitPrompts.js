const readline = require("readline");
const chalk = require("./chalk-messages.js");
const { validateUserInput } = require("./validateUserInput.js");
const { displayCommitTypes } = require("./logger.js");
const { promptCommitDest } = require("./promptCommitDest.js");
const { writeLocalCommit } = require("./writeLocalCommit.js");
const { writeRemoteCommit } = require("./writeRemoteCommit.js");
const { forceRemoteCommit } = require("./forceRemoteCommit.js");

/**
 * Prompt the user for input unless the categoryFlag is "NONE".
 *
 * @param {string} categoryFlag - The commit categoryFlag, e.g., "TYPE", "DOMAIN", "MESSAGE", or "NONE".
 * @param {readline.Interface} rl - The readline interface for reading user input.
 * @returns {Promise<?string>} - A Promise that resolves to the user input or undefined if the categoryFlag is "NONE".
 */
const getUserCommitCategoryInput = async (categoryFlag, rl) => {
	return categoryFlag !== "NONE"
		? await validateUserInput(`Enter a commit ${categoryFlag}:`, rl, categoryFlag)
		: undefined;
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
	let commitType, commitDomain, commitMsg, completeCommitMsg, commitAmendChoice, remoteCommitOk;

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

			// Prompt user to confirm the commit message
			let localCommitConfirm = await validateUserInput(
				"Confirm commit message is OK? ( Y / N / QUIT):",
				rl,
				"LOCAL COMMIT"
			);

			if (["yes", "y"].includes(localCommitConfirm.toLowerCase())) {
				// Break out of while loop
				break;
			} else if (["quit", "q", "end"].includes(localCommitConfirm.toLowerCase())) {
				// Quit cmd line program
				process.exitCode = 0;
				rl.close();
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

		// Make a local commit
		await writeLocalCommit(completeCommitMsg, rl);

		// Ask user to commit to remote
		let remoteCommitCheck = await promptCommitDest("Push commit to remote? (Y / N)", "REMOTE", rl);

		// Commit to remote if the user assents
		if (remoteCommitCheck === true) {
			remoteCommitOk = await writeRemoteCommit(rl);
		}

		// Force push remote commit if it fails initially
		if (remoteCommitOk === false) {
			await promptCommitDest(`Force push to remote? (Y / N)`, "REMOTE", rl);
			// Todo -> invoke a promptForceRemoteCommit fn. here
			// Other potential options could be rebase, pull, etc
			// ..
			// await forceRemoteCommit(rl);
		}
	} catch (error) {
		console.error(chalk.fail(`executeCommitPrompts fn. error`));
		console.error(chalk.warningStrong(error));
		process.exitCode = 1;
	} finally {
		// Close the readline interface and exit the process
		process.exitCode = 0;
		rl.close();
	}
}

module.exports = { executeCommitPrompts };
