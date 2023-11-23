const chalk = require("../src/lib/chalkMessages");
const { runProgram } = require("./main");
const { createReadlineInterface } = require("./lib/createReadlineInterface");
const { promptUserForLogging } = require("./promptUserForLogging");
const { getWorkingGitFiles } = require("./lib/getWorkingGitFiles");

(async () => {
	// Get array of all un-committed .git files
	const workingGitFiles = getWorkingGitFiles();

	//
	if (workingGitFiles.length === 0) {
		console.log(chalk.consoleY("Nothing to commit locally. Everything up to date."));
		process.exit();
	}

	// Create a readline interface to prompt the user for input
	const rl = createReadlineInterface();

	// Prompt the user for logging preference
	const allowDevLoggingChk = await promptUserForLogging(rl);

	// 
	allowDevLoggingChk && (process.env.ALLOW_DEV_LOGGING = true);

	// Run the program
	await runProgram(rl, allowDevLoggingChk, workingGitFiles);
})();
