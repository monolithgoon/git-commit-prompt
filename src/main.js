const chalk = require("./lib/config/chalkConfig.js");
const { validateUserInput } = require("./lib/validators/validateUserInput.js");
const { writeLocalCommit } = require("./lib/writeLocalCommit.js");
const { writeRemoteCommit } = require("./lib/writeRemoteCommit.js");
const { writeFlaggedRemoteCommit } = require("./lib/writeFlaggedRemoteCommit.js");
const { mapStringToBoolean } = require("./lib/utils/mapStringToBoolean.js");
const { promptCommitCategoryInput } = require("./lib/promptCommitCategoryInput.js");
const { getRemoteBranches } = require("./lib/utils/getRemoteBranches.js");
const { execShellCommand } = require("./lib/utils/execShellCommand.js");
const { promptRemoteCommitFlag } = require("./lib/promptRemoteCommitFlag.js");
const promptScopeInput = require("./lib/promptScopeInput.js");
const { COMMIT_TYPES_DETAIL } = require("./lib/constants/commit_types.js");
const createProgramState = require("./lib/createProgramState.js");

function exitProgram(rlInterface) {
	process.exitCode = 0;
	rlInterface.close();
}

/**
 * @description Prompts the user for a commit message,
 * and then executes a git commit and push to remote.
 * @function runProgram
 */
async function runProgram(rl, allowDevLoggingChk, allWorkingGitFilesArr) {
	// Declare variables to store commit information
	let commitType,
		commitScope,
		commitMsg,
		completeCommitMsg,
		escapedCommitMsg,
		commitAmendChoice = null,
		localCommitOk,
		remoteCommitOk;

	/** remove => this doesn't belong here */
	// Show allowed commit types to user
	console.log({ COMMIT_TYPES_DETAIL });

	/** 
	 * SANDBOX
	 */
	
	// Get user inputed CLI args
	// const { cliAnswers, cliOptions, passThroughParams } = parseRuntimeArgs();

	// Init session state
	let cliState = null;

	// Set the dev. logging check option in CLI state
	if (allowDevLoggingChk) {
		// cliState = createProgramState({ disableEmoji: cliOptions.disableEmoji });
	} else {
		cliState = createProgramState();
	}

	console.log({ cliState });

	try {
		// Prompt the user for commit information until they confirm their message
		while (true) {
			// Check if the user has requested to change a specific part of the commit message
			// If they have, `commitAmmendChoice` is truthy
			switch (commitAmendChoice?.toUpperCase()) {
				case "TYPE":
					commitType = await promptCommitCategoryInput("TYPE", rl);
					break;

				case "SCOPE":
					// *** hack => to allow use combined use of node readline, and Inquirer ***
					rl.pause();
					commitScope = await promptScopeInput.selectGitFile(allWorkingGitFilesArr);
					rl.resume();
					break;

				case "MESSAGE":
					commitMsg = await promptCommitCategoryInput("MESSAGE", rl);
					break;

				case "NONE":
					break;

				default:
					// Here => `commitAmmendChoice` is falsy
					commitType = await promptCommitCategoryInput("TYPE", rl);
					// *** hack => to allow use combined use of node readline, and Inquirer ***
					rl.pause();
					commitScope = await promptScopeInput.selectGitFile(allWorkingGitFilesArr);
					// *** hack ***
					rl.resume();
					commitMsg = await promptCommitCategoryInput("MESSAGE", rl);
					break;
			}

			// Combine the commit information into a single message
			completeCommitMsg = `"[${commitType}] (${commitScope}) - ${commitMsg}"`;

			// Ensure proper quoting around the commit message to handle cases where the commit message contains special characters.
			// const escaptedCommitMsg = commitMsg.replace(/`/g, "\\`");

			// FIXME -> THIS IS CAUSING THE CMD. LINE TO THROW AN ERROR
			escapedCommitMsg = completeCommitMsg.replace(/`/g, "\\`");

			// Alert user
			console.table({ commit_type: commitType, commit_domain: commitScope, commit_msg: commitMsg });

			// Alert user
			console.log({ escapedCommitMsg });
			// console.log("Before execShellCommand");
			// await execShellCommand(`cat src/index.js`);
			// await execShellCommand(`echo "Commit Message: ${escapedCommitMsg}"`);
			// console.log("After execShellCommand");

			// Prompt user to confirm the commit message
			let commitMsgConfirmOk = await validateUserInput(
				"Confirm commit message is OK? ( yes / no / quit) >",
				rl,
				"COMMIT_MESSAGE_OK"
			);

			// commitMsgConfirmOk => "Y"
			// If the user determines their message is not OK, allow them to amend it
			if (!mapStringToBoolean(commitMsgConfirmOk)) {
				commitAmendChoice = await validateUserInput(
					`Select which prompt to amend ( "TYPE", "SCOPE", "MESSAGE", "NONE") >`,
					rl,
					"AMEND"
				);
			}

			// commitMsgConfirmOk => "N"
			// Break out of while loop if user is ok with commit msg.
			if (mapStringToBoolean(commitMsgConfirmOk)) break;

			// commitMsgConfirmOk => "QUIT"
			// Quit cmd line program if user chooses the option
			if (["quit", "q", "end"].includes(commitMsgConfirmOk.toLowerCase())) exitProgram(rl);
		}

		// Ask user to commit to remote
		const askToLocalCommit = mapStringToBoolean(
			await validateUserInput("Write local commit (yes / no)", rl, "YES_NO_RESPONSE")
		);

		// Alert user
		allowDevLoggingChk && console.log({ askToLocalCommit });

		// Recursively re-start program
		!askToLocalCommit && (await runProgram(rl, allowDevLoggingChk, allWorkingGitFilesArr));

		// Proceed -> Write local commit
		askToLocalCommit && (localCommitOk = await writeLocalCommit(rl, escapedCommitMsg));
		// askToLocalCommit && (localCommitOk = true)

		// Alert user
		allowDevLoggingChk && console.log({ localCommitOk });

		// Quit program if local commit fails
		!localCommitOk && (await runProgram(rl, allowDevLoggingChk, allWorkingGitFilesArr));

		// Ask user to commit to remote
		const askRemoteCollab = mapStringToBoolean(
			await validateUserInput("Collaborate with remote? (yes / no)", rl, "YES_NO_RESPONSE")
		);

		// Alert user
		allowDevLoggingChk && console.log({ askRemoteCollab });

		// Close program if user declines to collab. with remote
		// !askRemoteCollab && exitProgram(rl);
		if (!askRemoteCollab) exitProgram(rl);

		// Display available remote repo names
		const remoteBranches = await getRemoteBranches(rl);

		// Alert user
		console.info({ remoteBranches });

		/**
		 * todo => open git diff output below in nano
		 */

		// const askShowRemoteDiff = mapStringToBoolean(
		// 	await validateUserInput("Review diff with remote? (yes / no)", rl, "YES_NO_RESPONSE")
		// );

		// // Alert user
		// allowDevLoggingChk && console.log({ askShowRemoteDiff });

		// // Prompt user to be show diff. with remote branch
		// askShowRemoteDiff && (await execShellCommand(`git show feature/inquirer-list-changed-files --minimal`, rl));

		// Commit to remote if the user assents
		// rl.pause()
		remoteCommitOk = await writeRemoteCommit(rl);
		// rl.resume()

		// Alert user
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
