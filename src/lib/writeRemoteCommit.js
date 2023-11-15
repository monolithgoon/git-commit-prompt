const chalk = require("../chalk-messages.js");
const { execAsync } = require("./execAsync.js");


async function writeRemoteCommit(readLineInterface) {
	console.log(chalk.consoleGy("Committing to remote .."));
	try {
		// TODO > create a const. for the phrase `git push oritin master`
		const pushRemoteCommitResponse = await execAsync(`git push origin master`, readLineInterface);
		console.log(`pushRemoteCommitResponse:`);
		console.log(chalk.consoleG(pushRemoteCommitResponse));
		return true;
	} catch (error) {
		return false;
	}
}

exports.writeRemoteCommit = writeRemoteCommit;
