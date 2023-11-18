const chalk = require("./lib/chalkMessages.js");
const { validateUserInput } = require("./lib/validators/validateUserInput.js");
const { writeLocalCommit } = require("./writeLocalCommit.js");
const { writeRemoteCommit } = require("./writeRemoteCommit.js");
const { flaggedRemoteCommit } = require("./flaggedRemoteCommit.js");
const { mapStringToBoolean } = require("./lib/mapStringToBoolean.js");
const { getUserCommitCategoryInput } = require("./getUserCommitCategoryInput.js");
const { logger } = require("./lib/logger.js");
const { readlineQuestionAsync } = require("./lib/readlineQuestionAsync.js");

/**
 * @description Prompts the user for a commit message,
 * and then executes a git commit and push to remote.
 * @function runProgram
 */
async function runProgram(rl, allowDevLoggingChk) {
	// Declare variables to store commit information
	let commitType,
		commitDomain,
		commitMsg,
		completeCommitMsg,
		commitAmendChoice,
		localCommitOk,
		remoteCommitOk,
		askFlaggedRemoteCommit;

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
			completeCommitMsg = `["${commitType}] (${commitDomain}) - ${commitMsg}"`;

			logger(completeCommitMsg, allowDevLoggingChk, "production");

			// Prompt user to confirm the commit message
			let localCommitConfirm = await validateUserInput(
				"Confirm commit message is OK? ( yes / no / quit):",
				rl,
				"COMMIT_MESSAGE_OK"
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

		// Ask user to commit to remote
		const askLocalCommit = mapStringToBoolean(
			await validateUserInput("Write local commit (yes / no)", rl, "YES_NO_RESPONSE")
		);

		//
		askLocalCommit && (await (localCommitOk = writeLocalCommit(completeCommitMsg, rl)));

		// Quit program if local commit fails
		if (!localCommitOk) {
			process.exitCode = 0;
			rl.close();
		};

		// Ask user to commit to remote
		const askRemoteCollab = mapStringToBoolean(
			await validateUserInput("Collaborate with remote? (yes / no)", rl, "YES_NO_RESPONSE")
		);

		// Alert user
		logger(askRemoteCollab, allowDevLoggingChk);

		// Commit to remote if the user assents
		askRemoteCollab && (remoteCommitOk = await writeRemoteCommit(rl));

		// Alert user
		logger(remoteCommitOk, allowDevLoggingChk);

		// Ask to force push remote commit if it fails initially
		!remoteCommitOk &&
			(askFlaggedRemoteCommit = mapStringToBoolean(
				await validateUserInput(`Try to commit to remote with flags? (yes / no)`, rl, "YES_NO_RESPONSE")
			));

		logger(askFlaggedRemoteCommit, allowDevLoggingChk);

		// Ask to user to proceed
		const askToProceed = mapStringToBoolean(
			await validateUserInput("Continue with commit? (yes / no)", rl, "YES_NO_RESPONSE")
		);

		// Alert user
		logger(askToProceed, allowDevLoggingChk);

		// Force push commit to remote
		askFlaggedRemoteCommit && (await flaggedRemoteCommit(rl));

		//
		readlineQuestionAsync(`Do you want to write a custom .git command? (yes / no)`, rl);

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
