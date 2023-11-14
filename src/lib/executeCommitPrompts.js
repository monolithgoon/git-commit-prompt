const readline = require("readline");
const chalk = require("../chalk-messages.js");
const { COMMIT_TYPES_DETAIL } = require("./constants/commit-types.js");
const { askCommitPrompt } = require("./askCommitPrompt.js");
const { execAsync } = require("./execAsync.js");
const { writeLocalCommit } = require("./writeLocalCommit.js");
const { writeRemoteCommit } = require("./writeRemoteCommit.js");
const { forceRemoteCommit } = require("./forceRemoteCommit.js");

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

	console.log(chalk.consoleYlow(`Valid commit types:`));
	console.log({ COMMIT_TYPES_DETAIL });

	// Declare variables to store commit information
	let commitType,
		commitDomain,
		commitMsg,
		completeCommitMsg,
		commitConfirm,
		commitAmendChoice,
		// commitResponse,
		askRemoteCommit,
		remoteCommitOk,
		askForceCommitOrigin,
		pushOriginResponse;

	try {
		// Prompt the user for commit information until they confirm their message
		while (true) {
			// Check if the user has requested to change a specific part of the commit message
			switch (commitAmendChoice?.toUpperCase()) {
				case "TYPE":
					commitType = await askCommitPrompt("Enter a commit TYPE:", rl, "TYPE");
					break;

				case "DOMAIN":
					commitDomain = await askCommitPrompt("Enter a commit DOMAIN:", rl, "DOMAIN");
					break;

				case "MESSAGE":
					commitMsg = await askCommitPrompt("Enter a commit MESSAGE:", rl, "MESSAGE");
					break;

				case "NONE":
					break;

				default:
					// Prompt the user for the full commit message if no amendment is requested
					commitType = await askCommitPrompt("Enter a commit TYPE:", rl, "TYPE");
					commitDomain = await askCommitPrompt("Enter a commit DOMAIN:", rl, "DOMAIN");
					commitMsg = await askCommitPrompt("Enter a commit MESSAGE:", rl, "MESSAGE");
					break;
			}

			// Combine the commit information into a single message
			completeCommitMsg = `"${commitType} (${commitDomain}) - ${commitMsg}"`;

			console.log({ completeCommitMsg });

			// Confirm the commit message with the user
			commitConfirm = await askCommitPrompt("Confirm commit message is OK? ( Y / N / QUIT):", rl, "CONFIRM");

			if (["yes", "y"].includes(commitConfirm.toLowerCase())) {
				// Break out of while loop
				break;
			} else if (["quit", "q", "end"].includes(commitConfirm.toLowerCase())) {
				// Quit cmd line program
				process.exit(0);
			} else {
				// If the user doesn't confirm their message, allow them to amend it
				console.log({ commitType });
				console.log({ commitDomain });
				console.log({ commitMsg });
				commitAmendChoice = await askCommitPrompt(
					`Select which prompt to amend ( "TYPE", "DOMAIN", "MESSAGE", "NONE"):`,
					rl,
					"AMEND"
				);
			}
		}

		// Make a local commit
		await writeLocalCommit(completeCommitMsg, rl);

		// Prompt user to commit to origin / master
		askRemoteCommit = await askCommitPrompt("Push commit to remote origin? ( Y / N )", rl, "ORIGIN");

		remoteCommitOk = writeRemoteCommit(rl);

		if (!remoteCommitOk) forceRemoteCommit(rl);

		process.exit(0);

		// User chooses to commit to remote origin
		if (["yes", "y"].includes(askRemoteCommit.toLowerCase())) {
			console.log(chalk.consoleGy("Committing to origin .."));

			pushOriginResponse = await execAsync(`git push origin master`, rl);

			console.log(`pushOriginResponse:`);
			console.log(chalk.consoleG(pushOriginResponse));
			// try {
			// 	pushOriginResponse = await execAsync(`git push origin master`, rl);
			// 	console.log(`pushOriginResponse`);
			// 	console.log(chalk.consoleG(pushOriginResponse));
			// } catch (error) {
			// 	console.error(chalk.fail(`origin commit error:`))
			// 	console.error(chalk.fail(error))
			// 	// Give option to user to force the commit to origin
			// 	console.log(error)
			// 	// if (error.message.toLowerCase().includes("command failed")) {
			// 	// 	const askForceCommitOrigin = await askCommitPrompt("Force push commit to remote origin? ( Y / N )", rl, "ORIGIN");
			// 	// 	if (["yes", "y"].includes(askForceCommitOrigin.toLowerCase())) {
			// 	// 		console.log(chalk.consoleGy("Committing to origin .."));
			// 	// 		try {
			// 	// 			pushOriginResponse = await execAsync(`git push origin master`, rl);
			// 	// 			console.log(`pushOriginResponse:`);
			// 	// 			console.log(chalk.consoleG(pushOriginResponse));
			// 	// 		} catch (error) {
			// 	// 			console.error(chalk.fail(`origin commit error: ${error}`));
			// 	// 		}
			// 	// 	}
			// 	// }
			// }	finally {
			// 	rl.close();
			// 	process.exit();
			// }
		} else {
		}
	} catch (error) {
		console.error(chalk.fail(`executeCommitPrompts error`));
		console.error(chalk.consoleYlow(error.message));

		// if (error.message.toLowerCase().includes("command failed")) {
		// 	askForceCommitOrigin = await askCommitPrompt("Force push commit to remote origin? ( Y / N )", rl, "ORIGIN");
		// 	if (["yes", "y"].includes(askForceCommitOrigin.toLowerCase())) {
		// 		console.log(chalk.consoleGy("Committing to origin .."));
		// 		try {
		// 			pushOriginResponse = await execAsync(`git push origin master --force`, rl);
		// 			console.log({ pushOriginResponse });
		// 		} catch (error) {
		// 			console.error(chalk.fail(`origin commit error: ${error}`));
		// 		}
		// 	}
		// 	console.log("yeo are here")
		// 	rl.close();
		// 	process.exit(0);
		// }
	} finally {
		// Close the readline interface and exit the process
		rl.close();
		process.exit();
	}
}

module.exports = { executeCommitPrompts };
