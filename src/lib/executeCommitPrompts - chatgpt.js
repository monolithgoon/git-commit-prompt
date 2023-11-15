const readline = require("readline");
const chalk = require("../chalk-messages.js");
const { askCommitPrompt } = require("./promptUserInput.js");
const { writeLocalCommit } = require("./writeLocalCommit.js");
const { writeRemoteCommit } = require("./writeRemoteCommit.js");
const { forceRemoteCommit } = require("./forceRemoteCommit.js");
const { displayCommitTypes } = require("./lib.js");

async function amendCommit(type, rl) {
	if (type === commitAmendChoice?.toUpperCase()) {
		return await askCommitPrompt(`Enter a commit ${type}:`, rl, type);
	}
	return null;
}

async function getCommitInformation(rl) {
	let commitType, commitDomain, commitMsg, commitAmendChoice;

	while (true) {
		commitType = await amendCommit("TYPE", rl);
		commitDomain = await amendCommit("DOMAIN", rl);
		commitMsg = await amendCommit("MESSAGE", rl);

		if (commitAmendChoice === "NONE") {
			break;
		} else {
			commitAmendChoice = await askCommitPrompt(
				`Select which prompt to amend ( "TYPE", "DOMAIN", "MESSAGE", "NONE"):`,
				rl,
				"AMEND"
			);
		}
	}

	return { commitType, commitDomain, commitMsg };
}

function buildCompleteCommitMessage({ commitType, commitDomain, commitMsg }) {
	return `"${commitType} (${commitDomain}) - ${commitMsg}"`;
}

async function confirmCommit(rl, completeCommitMsg) {

	console.log({ completeCommitMsg });

	const commitConfirm = await askCommitPrompt("Confirm commit message is OK? ( Y / N / QUIT):", rl, "CONFIRM");

	if (["yes", "y"].includes(commitConfirm.toLowerCase())) {
		return true;
	} else if (["quit", "q", "end"].includes(commitConfirm.toLowerCase())) {
		process.exit(0);
	}

	console.log({ commitType, commitDomain, commitMsg });
	
	commitAmendChoice = await askCommitPrompt(
		`Select which prompt to amend ( "TYPE", "DOMAIN", "MESSAGE", "NONE"):`,
		rl,
		"AMEND"
	);

	return false;
}

async function executeCommitPrompts() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	try {
		displayCommitTypes();

		const commitInfo = await getCommitInformation(rl);

		const completeCommitMsg = buildCompleteCommitMessage(commitInfo);

		if (await confirmCommit(rl, completeCommitMsg)) {
			
			await writeLocalCommit(completeCommitMsg, rl);

			const askRemoteCommit = await askCommitPrompt("Push commit to remote origin? ( Y / N )", rl, "ORIGIN");

			if (!writeRemoteCommit(rl, askRemoteCommit)) {
				forceRemoteCommit(rl);
			}

			process.exitCode = 0;
		} else {
			process.exitCode = 1;
		}
	} catch (error) {
		console.error(chalk.fail(`executeCommitPrompts error`));
		console.error(chalk.consoleYlow(error.message));
		process.exitCode = 1;
	} finally {
		rl.close();
	}
}

module.exports = { executeCommitPrompts };
