const chalk = require("./lib/config/chalkConfig");
const { runProgram } = require("./main");
const { createReadlineInterface } = require("./lib/utils/createReadlineInterface");
const { promptUserForLogging } = require("./lib/promptUserForLogging");
const { getActiveGitFiles } = require("./lib/utils/getActiveGitFiles");
const { getUniquePaths } = require("./lib/utils/getUniqueDirectories");

(async () => {
	// Get array of all un-committed .git files
	const activeGitFiles = getActiveGitFiles();

	// console.log(activeGitFiles)

	//
	if (activeGitFiles.length === 0) {
		console.log(chalk.consoleYB("Nothing to commit locally. Everything up to date."));
		process.exit();
	}

	//
	const activeGitFilePaths = getUniquePaths(activeGitFiles.map((el) => el.value));

	// Create a readline interface to prompt the user for input
	const rl = createReadlineInterface();

	// Prompt the user for logging preference
	const allowDevLoggingChk = await promptUserForLogging(rl);

	//
	allowDevLoggingChk && (process.env.ALLOW_DEV_LOGGING = true);

	// Run the program
	await runProgram(rl, allowDevLoggingChk, activeGitFilePaths);
})();
