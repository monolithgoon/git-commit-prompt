const chalk = require("./lib/chalkMessages.js");
const { COMMIT_TYPES_DETAIL } = require("./lib/constants/commit_types.js");
const { validateUserInput } = require("./lib/validators/validateUserInput.js");
const { writeLocalCommit } = require("./writeLocalCommit.js");
const { writeRemoteCommit } = require("./writeRemoteCommit.js");
const { writeFlaggedRemoteCommit } = require("./writeFlaggedRemoteCommit.js");
const { mapStringToBoolean } = require("./lib/mapStringToBoolean.js");
const { getUserCommitCategoryInput } = require("./promptCategoryInput.js");
const { getRemoteBranches } = require("./lib/getRemoteBranches.js");
const { execAsync } = require("./lib/execAsync.js");
const { promptRemoteCommitFlag } = require("./promptRemoteCommitFlag.js");
const promptDomainInput = require("./promptDomainInput.js");

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
		commitDomain,
		commitMsg,
		completeCommitMsg,
		commitAmendChoice = null,
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
					// commitDomain = await getUserCommitCategoryInput("DOMAIN", rl);
					commitDomain = await promptDomainInput.selectGitFile(allWorkingGitFilesArr);
					break;

				case "MESSAGE":
					commitMsg = await getUserCommitCategoryInput("MESSAGE", rl);
					break;

				case "NONE":
					break;

				default:
					// Here => `commitAmmendChoice` is falsy
					commitType = await getUserCommitCategoryInput("TYPE", rl);
					// *** hack => to allow use combined use of node readline, and Inquirer ***
					rl.pause();
					commitDomain = await promptDomainInput.selectGitFile(allWorkingGitFilesArr);
					// *** hack ***
					rl.resume();
					commitMsg = await getUserCommitCategoryInput("MESSAGE", rl);
					break;
			}

			// Alert user
			allowDevLoggingChk && console.log({ commitType });
			allowDevLoggingChk && console.log({ commitDomain });
			allowDevLoggingChk && console.log({ commitMsg });

			// Combine the commit information into a single message
			completeCommitMsg = `"[${commitType}] (${commitDomain}) - ${commitMsg}"`;

			// Alert user
			console.table({ completeCommitMsg });

			// Prompt user to confirm the commit message
			let commitMsgConfirmOk = await validateUserInput(
				"Confirm commit message is OK? ( yes / no / quit):",
				rl,
				"COMMIT_MESSAGE_OK"
			);

			// commitMsgConfirmOk => "Y"
			// If the user determines their message is not OK, allow them to amend it
			if (!mapStringToBoolean(commitMsgConfirmOk)) {
				commitAmendChoice = await validateUserInput(
					`Select which prompt to amend ( "TYPE", "DOMAIN", "MESSAGE", "NONE"):`,
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
		allowDevLoggingChk && console.log({ askRemoteCollab });

		// Close program if user declines to collab. with remote
		!askRemoteCollab && exitProgram(rl);

		// Display available remote repo names
		const remoteBranches = await getRemoteBranches(rl);

		// Alert user
		console.table({ remoteBranches });

		/** 
		 * todo => open nano editor hre
		 */
		// const askShowRemoteDiff = mapStringToBoolean(
		// 	await validateUserInput("Show diff with remote? (yes / no)", rl, "YES_NO_RESPONSE")
		// );

		// // Alert user
		// allowDevLoggingChk && console.log({ askShowRemoteDiff });

		// // Prompt user to be show diff. with remote branch
		// askShowRemoteDiff && (await execAsync(`git show feature/inquirer-list-changed-files --minimal`, rl));

		// Commit to remote if the user assents
		remoteCommitOk = await writeRemoteCommit(rl);

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
