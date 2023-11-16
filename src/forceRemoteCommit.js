const chalk = require("./lib/chalk-messages.js");
const { execAsync } = require("./execAsync.js");

async function forceRemoteCommit(readLineInterface) {
	console.log(chalk.consoleGy("Force pushing to remote .."));

	try {
		pushOriginResponse = await execAsync(`git push origin master --force`, readLineInterface);
		console.log({ pushOriginResponse });
	} catch (error) {
		console.error(chalk.fail(`remote commit error: ${error}`));
		process.exitCode = 0;
	}
}

exports.forceRemoteCommit = forceRemoteCommit;
