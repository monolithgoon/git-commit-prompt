const chalk = require("./lib/config/chalkConfig");
const { runProgram } = require("./main");
const { createReadlineInterface } = require("./lib/utils/createReadlineInterface");
const { promptUserForLogging } = require("./lib/promptUserForLogging");
const { getActiveGitFiles } = require("./lib/utils/getActiveGitFiles");
const { getUniquePaths } = require("./lib/utils/getUniqueDirectories");
const initGlobalState = require("./lib/_initGlobalState");

(async () => {
	try {
		//
		const rl = createReadlineInterface();

		// Get array of all un-committed .git files
		const activeGitFiles = getActiveGitFiles();

		if (activeGitFiles.length === 0) {
			console.log(chalk.consoleYB("Nothing to commit locally. Everything up to date."));
			process.exit(0); // Use exit code 0 for success
		}

		// Prompt the user for logging preference
		const allowDevLoggingChk = await promptUserForLogging(rl);

		// *** todo ***
		// Select default config options from checklist
		const commitAllFilesChk = await promptUserForLogging(rl);

		// Set Node env variable based on user preferences
		process.env.ALLOW_DEV_LOGGING = allowDevLoggingChk;

		// Extract unique file paths from the array of uncommitted Git files
		const activeGitFilePaths = getUniquePaths(activeGitFiles.map(({ value }) => value));

		// Set global state defaultConfig object based on user preferences
		const globalState = initGlobalState({ allowDevLoggingChk, commitAllFilesChk });

		// Update global state properties
		globalState.sessionReadlineInterface = rl;
		globalState.activeGitScopes = [...activeGitFilePaths];

		// Run the program
		await runProgram(globalState);
	} catch (error) {
		console.error(chalk.fail("An unexpected error occurred:", error));
		process.exit(1); // Use exit code 1 for general errors
	}
})();
