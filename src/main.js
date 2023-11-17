const chalk = require("./lib/chalkMessages.js");
const { validateUserInput } = require("./lib/validators/validateUserInput.js");
const { writeLocalCommit } = require("./writeLocalCommit.js");
const { writeRemoteCommit } = require("./writeRemoteCommit.js");
const { flaggedRemoteCommit } = require("./flaggedRemoteCommit.js");
const { mapStringToBoolean } = require("./lib/mapStringToBoolean.js");
const { getUserCommitCategoryInput } = require("./getUserCommitCategoryInput.js");
const { logger } = require("./lib/logger.js");

/**
 * @description Prompts the user for a commit message,
 * and then executes a git commit and push to remote.
 * @function runProgram
 */
async function runProgram(rl, allowDevLoggingChk) {
	// Declare variables to store commit information
	let commitType, commitDomain, commitMsg, completeCommitMsg, commitAmendChoice, remoteCommitOk, askForceRemoteCommit;

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

			logger(completeCommitMsg, allowDevLoggingChk, "production")

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
		let askRemoteCommit = mapStringToBoolean(
			await validateUserInput("Collaborate with remote? (Y / N)", rl, "YES_NO_RESPONSE")
		);

		logger(askRemoteCommit, allowDevLoggingChk);

		// Commit to remote if the user assents
		askRemoteCommit && (remoteCommitOk = await writeRemoteCommit(rl));

		logger(remoteCommitOk, allowDevLoggingChk);

		// Ask to force push remote commit if it fails initially
		!remoteCommitOk &&
			(askForceRemoteCommit = mapStringToBoolean(
				await validateUserInput(`Try to commit to remote with flags? (Y / N)`, rl, "YES_NO_RESPONSE")
			));

		logger(askForceRemoteCommit, allowDevLoggingChk);

		// Force push commit to remote
		askForceRemoteCommit && (await flaggedRemoteCommit(rl));

		//
	} catch (error) {
		console.error(chalk.fail(`runProgram fn. error`));
		console.error(chalk.fail(error));
		process.exitCode = 1;
	} finally {
		// Close the readline interface and exit the process
		process.exitCode = 0;
		rl.close();
	}
}

module.exports = { runProgram };