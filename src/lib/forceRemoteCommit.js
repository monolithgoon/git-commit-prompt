const chalk = require("../chalk-messages.js");
const { validateUserInput } = require("./validateUserInput.js");
const { execAsync } = require("./execAsync.js");


async function forceRemoteCommit(readLineInterface) {

	// 
	const askForceCommitOrigin = await validateUserInput(
		"Force push commit to remote? ( Y / N )",
		readLineInterface,
		"REMOTE"
	);

	if (["yes", "y"].includes(askForceCommitOrigin.toLowerCase())) {

		console.log(chalk.consoleGy("Force pushing to remote .."));

		try {
			pushOriginResponse = await execAsync(`git push origin master --force`, readLineInterface);
			console.log({ pushOriginResponse });
		} catch (error) {
			console.error(chalk.fail(`remote commit error: ${error}`));
			process.exit(0);
		}
	}

	console.log(chalk.connected("yeo are here"));
	rl.close();
	process.exit(0);
}

exports.forceRemoteCommit = forceRemoteCommit;
