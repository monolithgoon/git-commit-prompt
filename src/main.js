const path = require("path");
const chalk = require("./lib/config/chalkConfig.js");
const signale = require("signale");
const { validateUserInput } = require("./lib/validators/validateUserInput.js");
const { writeLocalCommit } = require("./lib/writeLocalCommit.js");
const { writeRemoteCommit } = require("./lib/writeRemoteCommit.js");
const { writeFlaggedRemoteCommit } = require("./lib/writeFlaggedRemoteCommit.js");
const { mapStringToBoolean } = require("./lib/utils/mapStringToBoolean.js");
const { promptCommitCategoryInput } = require("./lib/promptCommitCategoryInput.js");
const { getRemoteBranches } = require("./lib/utils/getRemoteBranches.js");
const { promptRemoteCommitFlag } = require("./lib/promptRemoteCommitFlag.js");
const promptScopeInput = require("./lib/promptScopeInput.js");
const { COMMIT_SUBJECT_TYPES_DETAIL } = require("./lib/constants/commit_subject_types.js");

// *** sandbox ***
const shellescape = require("shell-escape");
const initGlobalState = require("./lib/_initGlobalState.js");
const runInteractivePrompts = require("./lib/_runInteractivePromts.js");
const { pauseResumeReadline } = require("./lib/utils/pauseResumeReadline.js");
const getDotGitDirPath = require("./lib/utils/_getDotGitDirPath.js");
const parseCommandLineFlags = require("./lib/_parseCommandLineFlags.js");
const { execShellCommand } = require("./lib/utils/execShellCommand.js");

function exitProgram(rlInterface) {
	process.exitCode = 0;
	rlInterface.close();
}

/**
 * Executes a series of prompts to gather information for a Git commit,
 * writes the commit locally, and optionally pushes it to a remote repository.
 * @async
 * @function runProgram
 * @param {Object} globalState - The global state object containing session information.
 * @returns {Promise<void>} A Promise that resolves when the program completes.
 */
async function runProgram(globalState) {
	// Extract props. of global state
	const rl = globalState.sessionReadlineInterface;
	const gitScopes = globalState.activeGitScopes;
	const allowDevLoggingChk = globalState.config.allowDevLoggingChk;

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
	console.log({ COMMIT_SUBJECT_TYPES_DETAIL });

	/**
	 * SANDBOX
	 */

	// Get user inputed CLI args
	const { cliPromptFlags, cliConfigFlags, otherUnspecifiedArgs } = parseCommandLineFlags();

	// Prompt the user for parts of the commit message, and
	// Write the responses to the global state
	await pauseResumeReadline(rl, runInteractivePrompts, globalState, cliPromptFlags);

	// Init a .git commit msg. file
	const commitMsgFile = path.join(getDotGitDirPath(), "COMMIT_EDITMSG");
	console.log({ commitMsgFile });

	// Alert user
	allowDevLoggingChk && console.table(globalState.promptResponseData);

	// **** todo
	// fs.writeFileSync(commitMsgFile, message);

	// **** todo
	// const message = formatCommitMessage(state);

	// **** todo
	// const appendedArgs = [];

	// Escape and stringify an array of arguments to be executed on the shell
	const command = shellescape([
		"git",
		"commit",
		"--file",
		commitMsgFile,
		// ...appendedArgs
	]);

	// **** todo
	// execShellCommand(command);

	/**
	 * SANDBOX
	 */

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
					// rl.pause();
					// commitScope = await promptScopeInput.selectGitFile(gitScopes);
					// rl.resume();
					// *** hack => to allow use combined use of node readline, and Inquirer ***
					commitScope = await pauseResumeReadline(rl, promptScopeInput.selectGitFile, gitScopes);
					break;

				case "MESSAGE":
					commitMsg = await promptCommitCategoryInput("MESSAGE", rl);
					break;

				case "NONE":
					break;

				default:
					// Here => `commitAmmendChoice` is falsy
					commitType = await promptCommitCategoryInput("TYPE", rl);
					// commitScope = await promptScopeInput.selectGitFile(gitScopes);
					// *** hack => to allow use combined use of node readline, and Inquirer ***
					commitScope = await pauseResumeReadline(rl, promptScopeInput.selectGitFile, gitScopes);
					commitMsg = await promptCommitCategoryInput("MESSAGE", rl);
					break;
			}

			// Combine the commit information into a single message
			completeCommitMsg = `"[${commitType}] (${commitScope}) - ${commitMsg}"`;

			// Ensure proper quoting around the commit message to handle cases where the commit message contains special characters.
			// FIXME -> THIS IS CAUSING THE CMD. LINE TO THROW AN ERROR
			escapedCommitMsg = completeCommitMsg.replace(/`/g, "\\`");

			// Alert user
			console.table({ commit_type: commitType, commit_domain: commitScope, commit_msg: commitMsg });

			// Alert user
			console.log({ escapedCommitMsg });

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
			await validateUserInput("Proceed (yes) or re-start from beginning (no) >", rl, "YES_NO_RESPONSE")
		);

		// Alert user
		allowDevLoggingChk && console.log({ askToLocalCommit });

		// Recursively re-start program
		!askToLocalCommit && (await runProgram(rl, allowDevLoggingChk, gitScopes));

		// Proceed -> Write local commit
		askToLocalCommit && (localCommitOk = await writeLocalCommit(rl, escapedCommitMsg));
		// askToLocalCommit && (localCommitOk = true)

		// Alert user
		allowDevLoggingChk && console.log({ localCommitOk });

		// Quit program if local commit fails
		!localCommitOk && (await runProgram(rl, allowDevLoggingChk, gitScopes));

		// Ask user to commit to remote
		const askRemoteCollab = mapStringToBoolean(
			await validateUserInput("Collaborate with remote? (yes / no) >", rl, "YES_NO_RESPONSE")
		);

		// Alert user
		allowDevLoggingChk && console.log({ askRemoteCollab });

		// Close program if user declines to collab. with remote
		// !askRemoteCollab && exitProgram(rl);
		if (!askRemoteCollab) exitProgram(rl);

		// Display available remote repo names
		const remoteBranches = await getRemoteBranches(rl);

		// Alert user
		// console.info({ remoteBranches });
		signale.info({ prefix: "[Remote Branches]" }, remoteBranches);

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
				await validateUserInput("Continue with remote commit? (yes / no) >", rl, "YES_NO_RESPONSE")
			));

		// Exit program if user declines to proceed
		!askToProceed && exitProgram(rl);

		// Ask to user to proceed
		let promptFlaggedRemoteCommit = false;
		!remoteCommitOk &&
			(promptFlaggedRemoteCommit = mapStringToBoolean(
				await validateUserInput(
					"Do you want to write a --flagged .git command to commit to remote? (yes / no) >",
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
					`Do you want to write a custom .git command with --flags? (yes / no) >`,
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
		console.log(chalk.consoleGyB("Closing program ..."));
		// Close the readline interface and exit the process
		exitProgram(rl);
	}
}

module.exports = { runProgram };
