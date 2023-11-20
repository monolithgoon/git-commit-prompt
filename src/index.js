const chalk = require("../src/lib/chalkMessages");
const { runProgram } = require("./main");
const { createReadlineInterface } = require("./lib/createReadlineInterface");
const { promptUserForLogging } = require("./promptUserForLogging");
const { getWorkingGitFiles } = require("./lib/getWorkingGitFiles");

(async () => {
	// Get array of all un-committed .git files
	const allFilesArray = getWorkingGitFiles();

	//
	if (allFilesArray.length === 0) {
		console.log(chalk.consoleY("Nothing to commit. Everything up to date."));
		process.exit();
	}

	// Create a readline interface to prompt the user for input
	const rl = createReadlineInterface();

	// Prompt the user for logging preference
	const allowDevLoggingChk = await promptUserForLogging(rl);

	// Run the program
	await runProgram(rl, allowDevLoggingChk);
})();
