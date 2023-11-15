const chalk = require("../chalk-messages.js");
const { execAsync } = require("./execAsync.js");


async function writeRemoteCommit(readLineInterface) {
	console.log(chalk.consoleGy("Committing to remote .."));
	try {
		const pushOriginResponse = await execAsync(`git push origin master`, readLineInterface);
		console.log(`pushOriginResponse:`);
		console.log(chalk.consoleG(pushOriginResponse));
		return true;
	} catch (error) {
		return false;
	}
}

exports.writeRemoteCommit = writeRemoteCommit;
