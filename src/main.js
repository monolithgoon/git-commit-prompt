const chalk = require("./lib/chalkMessages.js");
const { validateUserInput } = require("./lib/validators/validateUserInput.js");
const { writeLocalCommit } = require("./writeLocalCommit.js");
const { writeRemoteCommit } = require("./writeRemoteCommit.js");
const { writeFlaggedRemoteCommit } = require("./writeFlaggedRemoteCommit.js");
const { mapStringToBoolean } = require("./lib/mapStringToBoolean.js");
const { getUserCommitCategoryInput } = require("./promptCategoryInput.js");
const { logger } = require("./lib/logger.js");
const { COMMIT_TYPES_DETAIL } = require("./lib/constants/commit_types.js");
const { getRemoteBranches } = require("./lib/getRemoteBranches.js");
const getInquirerInput = require("./promptDomainInput.js");
const { execAsync } = require("./lib/execAsync.js");
const { promptRemoteCommitFlag } = require("./promptRemoteCommitFlag.js");

function exitProgram(rlInterface) {
	process.exitCode = 0;
	rlInterface.close();
}

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

	// Show allowed commit types to user
	console.log(chalk.consoleYlow(`Valid commit types:`));
	console.log({ COMMIT_TYPES_DETAIL });

	try {
		// Prompt the user for commit information until they confirm their message
		while (true) {
			// Check if the user has requested to change a specific part of the commit message
			// If they have, `commitAmmendChoice` is truthy
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
					rl.pause();
					commitDomain = await getInquirerInput.selectGitFile();
					// commitDomain = await validateUserInput("", rl, "DOMAIN_INQUIRER");
					rl.resume();
					// commitDomain = await getUserCommitCategoryInput("DOMAIN", rl);
					commitMsg = await getUserCommitCategoryInput("MESSAGE", rl);
					break;
			}

			// Combine the commit information into a single message
			completeCommitMsg = `"[${commitType}] (${commitDomain}) - ${commitMsg}"`;

			// Alert user
			// logger(completeCommitMsg, allowDevLoggingChk, "production");
			console.table({ completeCommitMsg });

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
				exitProgram(rl);
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

		// Write local commit
		askLocalCommit && (await (localCommitOk = writeLocalCommit(rl, completeCommitMsg)));

		// Quit program if local commit fails
		!localCommitOk && exitProgram(rl);

		// Ask user to commit to remote
		const askRemoteCollab = mapStringToBoolean(
			await validateUserInput("Collaborate with remote? (yes / no)", rl, "YES_NO_RESPONSE")
		);

		// Alert user
		// logger(askRemoteCollab, allowDevLoggingChk);
		allowDevLoggingChk && console.log({ askRemoteCollab });

		// Close program if user declines to collab. with remote
		!askRemoteCollab && exitProgram(rl);

		// Display available remote repo names
		const remoteBranches = await getRemoteBranches(rl);

		// Alert user
		console.table({ remoteBranches });

		const askShowRemoteDiff = mapStringToBoolean(
			await validateUserInput("Show diff with remote? (yes / no)", rl, "YES_NO_RESPONSE")
		);

		// Alert user
		allowDevLoggingChk && console.log({ askShowRemoteDiff });

		// Prompt user to be show diff. with remote branch
		askShowRemoteDiff && (await execAsync(`git show feature/inquirer-list-changed-files --minimal`, rl));

		// Commit to remote if the user assents
		remoteCommitOk = await writeRemoteCommit(rl);

		// Alert user
		// logger(remoteCommitOk, allowDevLoggingChk);
		allowDevLoggingChk && console.log({ remoteCommitOk });

		// Ask to user to proceed
		let askToProceed = false;
		!remoteCommitOk &&
			(askToProceed = mapStringToBoolean(
				await validateUserInput("Continue with remote commit? (yes / no)", rl, "YES_NO_RESPONSE")
			));

		// Exit program if user declines to proceed
		!askToProceed && exitProgram(rl);

		// Ask to user to proceed
		let promptFlaggedRemoteCommit = false;
		!remoteCommitOk &&
			(promptFlaggedRemoteCommit = mapStringToBoolean(
				await validateUserInput(
					"Do you want to write a --flagged .git command to commit to remote? (yes / no)",
					rl,
					"YES_NO_RESPONSE"
				)
			));

		// Alert user
		allowDevLoggingChk && console.log({ promptFlaggedRemoteCommit });

		// Exit program if user declines
		!promptFlaggedRemoteCommit && exitProgram(rl);

		// Ask the user to input a commit flag
		const remoteCommitFlag = await promptRemoteCommitFlag(rl);

		// Force push commit to remote
		remoteCommitOk = await writeFlaggedRemoteCommit(rl, remoteCommitFlag);

		// Ask to force push remote commit if it fails initially
		let promptCustomRemoteCommand = false;
		!remoteCommitOk &&
			(promptCustomRemoteCommand = mapStringToBoolean(
				await validateUserInput(
					`Do you want to write a custom .git command with --flags? (yes / no)`,
					rl,
					"YES_NO_RESPONSE"
				)
			));

		// Alert user
		// logger(askFlaggedRemoteCommit, allowDevLoggingChk);
		allowDevLoggingChk && console.log({ promptCustomRemoteCommand });

		// Exit program if user declines
		!promptCustomRemoteCommand && exitProgram(rl);

		console.log(chalk.highlight("** write more code here ***"));
	} catch (error) {
		console.error(chalk.fail(`runProgram fn. error`));
		console.error(chalk.fail(error));
		process.exitCode = 1;
	} finally {
		console.log(chalk.consoleGy("Closing program ..."));
		// Close the readline interface and exit the process
		exitProgram(rl);
	}
}

module.exports = { runProgram };
