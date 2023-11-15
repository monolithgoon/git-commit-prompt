const chalk = require("../chalk-messages.js");
const { askCommitPrompt } = require("./promptUserInput.js");
const { execAsync } = require("./execAsync.js");


async function forceRemoteCommit(readLineInterface) {
	const askForceCommitOrigin = await askCommitPrompt(
		"Force push commit to remote origin? ( Y / N )",
		readLineInterface,
		"ORIGIN"
	);

	if (["yes", "y"].includes(askForceCommitOrigin.toLowerCase())) {
		console.log(chalk.consoleGy("Force pushing to origin .."));

		try {
			pushOriginResponse = await execAsync(`git push origin master --force`, readLineInterface);
			console.log({ pushOriginResponse });
		} catch (error) {
			console.error(chalk.fail(`origin commit error: ${error}`));
			process.exit(0);
		}
	}

	console.log("yeo are here");
	rl.close();
	process.exit(0);
}

exports.forceRemoteCommit = forceRemoteCommit;
