const chalk = require("./lib/config/chalkConfig");
const { runProgram } = require("./main");
const { createReadlineInterface } = require("./lib/utils/createReadlineInterface");
const { promptUserForLogging } = require("./lib/promptUserForLogging");
const { getWorkingGitFiles } = require("./lib/utils/getWorkingGitFiles");

(async () => {
	// Get array of all un-committed .git files
	const workingGitFiles = getWorkingGitFiles();

	//
	if (workingGitFiles.length === 0) {
		console.log(chalk.consoleYB("Nothing to commit locally. Everything up to date."));
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
