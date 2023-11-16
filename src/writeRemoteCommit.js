const chalk = require("./lib/chalk-messages.js");
const { execAsync } = require("./execAsync.js");
const { readlineQuestionAsync } = require("./readlineQuestionAsync.js");

async function writeRemoteCommit(readLineInterface) {
	try {
		// TODO > create a const. for the phrase `git push oritin master`

		// Display available remote repo names
		const remoteBranches = await execAsync(`git remote -v`, readLineInterface);
		console.log({ remoteBranches });

		// Validate remote repo. name
		const remoteRepoName = await readlineQuestionAsync(`Enter the name of the remote repo:`, readLineInterface);

		// Validate remote repo. branch name
		const remoteBranchName = await readlineQuestionAsync(`Enter the name of the remote branch:`, readLineInterface);

		console.log(chalk.consoleGy("Committing to remote .."));

		// Execute the commit command
		const pushRemoteCommitResponse = await execAsync(
			`git push ${remoteRepoName} ${remoteBranchName}`,
			readLineInterface
		);

		// Log the commit responses
		console.log(`pushRemoteCommitResponse:`);
		console.log(chalk.consoleG(pushRemoteCommitResponse));

		return true;
	} catch (error) {
		console.error(chalk.warningStrong(`writeRemoteCommit error: ${error}`));
		// throw new Error("Remote commit write failed");
		return false;
	}
}

exports.writeRemoteCommit = writeRemoteCommit;
