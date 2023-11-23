const chalk = require("./lib/chalkMessages.js");
const { COMMIT_TYPES_DETAIL } = require("./lib/constants/commit_types.js");
const { validateUserInput } = require("./lib/validators/validateUserInput.js");
const { writeRemoteCommit } = require("./writeRemoteCommit.js");
const { execShellCmd } = require("./lib/execShellCmd.js");
const { getRemoteBranches } = require("./lib/getRemoteBranches.js");
const { promptRemoteCommitFlag } = require("./promptRemoteCommitFlag.js");
const { getUserCommitCategoryInput } = require("./promptCategoryInput.js");
const { mapStringToBoolean } = require("./lib/mapStringToBoolean.js");
const { writeFlaggedRemoteCommit } = require("./writeFlaggedRemoteCommit.js");
const { writeLocalCommit } = require("./writeLocalCommit.js");
const promptDomainInput = require("./promptDomainInput.js");

/**
 * Function to exit the program and close the readline interface.
 * @param {readline.Interface} rlInterface - Readline interface to close.
 */
function exitProgram(rlInterface) {
	process.exitCode = 0;
	rlInterface.close();
}

/**
 * Function to retrieve commit information from the user.
 * @param {readline.Interface} rl - Readline interface for user input.
 * @param {string} commitAmendChoice - User's choice to amend commit.
 * @returns {Object} Object containing commitType, commitDomain, and commitMsg.
 */
async function getCommitInformation(rl, commitAmendChoice, allWorkingGitFilesArr) {
	let commitType, commitDomain, commitMsg;

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
			commitType = await getUserCommitCategoryInput("TYPE", rl);
			rl.pause();
			rl.resume();
			commitMsg = await getUserCommitCategoryInput("MESSAGE", rl);
			commitDomain = await promptDomainInput.selectGitFile(allWorkingGitFilesArr);
			break;
	}

	return { commitType, commitDomain, commitMsg };
}

/**
 * Function to confirm the commit message with the user.
 * @param {readline.Interface} rl - Readline interface for user input.
 * @param {string} commitType - Type of the commit.
 * @param {string} commitDomain - Domain of the commit.
 * @param {string} commitMsg - Commit message.
 * @returns {boolean} True if the user confirms, false otherwise.
 */
async function confirmCommitMessage(rl, commitType, commitDomain, commitMsg) {
	const completeCommitMsg = `"[${commitType}] (${commitDomain}) - ${commitMsg}"`;

	console.table({ completeCommitMsg });

	const localCommitConfirm = await validateUserInput(
		"Confirm commit message is OK? ( yes / no / quit):",
		rl,
		"COMMIT_MESSAGE_OK"
	);

  console.log(mapStringToBoolean(localCommitConfirm))

	return mapStringToBoolean(localCommitConfirm);
}

/**
 * Function to handle the user's choice to write a local commit.
 * @param {readline.Interface} rl - Readline interface for user input.
 * @returns {boolean} True if the user wants to write a local commit, false otherwise.
 */
async function handleLocalCommit(rl, commitCommand = ``) {
	const askLocalCommit = mapStringToBoolean(
		await validateUserInput("Write local commit (yes / no)", rl, "YES_NO_RESPONSE")
	);
	console.log({ commitCommand });
	return askLocalCommit && writeLocalCommit(rl, commitCommand);
}

/**
 * Function to handle the user's choice to collaborate with the remote repository.
 * @param {readline.Interface} rl - Readline interface for user input.
 * @returns {boolean} True if the user wants to collaborate, false otherwise.
 */
async function handleRemoteCollaboration(rl) {
	const askRemoteCollab = mapStringToBoolean(
		await validateUserInput("Collaborate with remote? (yes / no)", rl, "YES_NO_RESPONSE")
	);

	if (!askRemoteCollab) {
		exitProgram(rl);
	}

	const remoteBranches = await getRemoteBranches(rl);
	console.table({ remoteBranches });

	const askShowRemoteDiff = mapStringToBoolean(
		await validateUserInput("Show diff with remote? (yes / no)", rl, "YES_NO_RESPONSE")
	);

	if (askShowRemoteDiff) {
		await execShellCmd(`git show feature/inquirer-list-changed-files --minimal`, rl);
	}

	return true; // Placeholder for further implementation
}

/**
 * Function to handle the writing of a remote commit.
 * @param {readline.Interface} rl - Readline interface for user input.
 * @returns {boolean} True if the remote commit is successful, false otherwise.
 */
async function handleRemoteCommit(rl) {
	const remoteCommitOk = await writeRemoteCommit(rl);
	return remoteCommitOk;
}

/**
 * Main function to run the program.
 * @param {readline.Interface} rl - Readline interface for user input.
 * @param {boolean} allowDevLoggingChk - Flag to allow development logging.
 */
async function runProgram(rl, allowDevLoggingChk, allWorkingGitFilesArr) {
	let commitAmendChoice, completeCommitMsg;
	let askToProceed = true;
	let promptFlaggedRemoteCommit = true;
	let promptCustomRemoteCommand = true;

	console.log(chalk.consoleYlow(`Valid commit types:`));
	console.log({ COMMIT_TYPES_DETAIL });

	try {
		let { commitType, commitDomain, commitMsg } = await getCommitInformation(rl, commitAmendChoice, allWorkingGitFilesArr);

		while (!(await confirmCommitMessage(rl, commitType, commitDomain, commitMsg))) {
			console.log({ commitType, commitDomain, commitMsg });
			commitAmendChoice = await validateUserInput(
				`Select which prompt to amend ( "TYPE", "DOMAIN", "MESSAGE", "NONE"):`,
				rl,
				"AMEND"
			);

			({ commitType, commitDomain, commitMsg } = await getCommitInformation(rl, commitAmendChoice, allWorkingGitFilesArr));

			// Combine the commit information into a single message
			completeCommitMsg = `"[${commitType}] (${commitDomain}) - ${commitMsg}"`;
      console.log({completeCommitMsg})
		}

    console.log({completeCommitMsg})
    
		if (!(await handleLocalCommit(rl, completeCommitMsg))) {
			exitProgram(rl);
		}

		if (!(await handleRemoteCollaboration(rl))) {
			exitProgram(rl);
		}

		const remoteCommitOk = await handleRemoteCommit(rl);
		allowDevLoggingChk && console.log({ remoteCommitOk });

		// let askToProceed = true;

		if (!remoteCommitOk) {
			askToProceed = mapStringToBoolean(
				await validateUserInput("Continue with remote commit? (yes / no)", rl, "YES_NO_RESPONSE")
			);
		}

		if (!askToProceed) {
			exitProgram(rl);
		}

		// let promptFlaggedRemoteCommit = true;

		if (!remoteCommitOk) {
			promptFlaggedRemoteCommit = mapStringToBoolean(
				await validateUserInput(
					"Do you want to write a --flagged .git command to commit to remote? (yes / no)",
					rl,
					"YES_NO_RESPONSE"
				)
			);
		}

		allowDevLoggingChk && console.log({ promptFlaggedRemoteCommit });

		if (!promptFlaggedRemoteCommit) {
			exitProgram(rl);
		}

		const remoteCommitFlag = await promptRemoteCommitFlag(rl);
		const flaggedRemoteCommitOk = await writeFlaggedRemoteCommit(rl, remoteCommitFlag);

		// let promptCustomRemoteCommand = true;

		if (!flaggedRemoteCommitOk) {
			promptCustomRemoteCommand = mapStringToBoolean(
				await validateUserInput(
					`Do you want to write a custom .git command with --flags? (yes / no)`,
					rl,
					"YES_NO_RESPONSE"
				)
			);
		}

		allowDevLoggingChk && console.log({ promptCustomRemoteCommand });

		if (!promptCustomRemoteCommand) {
			exitProgram(rl);
		}

		console.log(chalk.highlight("** write more code here ***"));
	} catch (error) {
		console.error(chalk.fail(`runProgram fn. error`));
		console.error(chalk.fail(error));
		process.exitCode = 1;
	} finally {
		console.log(chalk.consoleGy("Closing program ..."));
		exitProgram(rl);
	}
}

module.exports = { runProgram };
