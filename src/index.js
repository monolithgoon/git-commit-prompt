const chalk = require("./lib/config/chalkConfig");
const fs = require("fs").promises;
exports.fs = fs;
const getGitRepoRootDir = require("./lib/utils/_getGitRepoRootDir");
const { runProgram } = require("./main");
const { createReadlineInterface } = require("./lib/utils/createReadlineInterface");
const { getActiveGitFiles } = require("./lib/utils/getActiveGitFiles");
const { getUniquePaths } = require("./lib/utils/getUniqueDirectories");
const initGlobalState = require("./lib/_initGlobalState");
const promptForInitConfigs = require("./lib/_runInitConfigPrompts");
const { persistJsonDataToFile } = require("./lib/utils/persistJsonDataToFile");
const { checkFileExists } = require("./lib/utils/checkFileExists");

// Execute the main functionality in an asynchronous IIFE
(async () => {
	try {
		// get root dir of project
		const rootDir = getGitRepoRootDir();

		// Create a Readline interface for user input
		const rl = createReadlineInterface();

		// Get an array of all uncommitted .git files
		const activeGitFiles = getActiveGitFiles();

		// Check if there are no uncommitted files
		if (activeGitFiles.length === 0) {
			console.log(chalk.consoleYB("Nothing to commit locally. Everything is up to date."));
			process.exit(0); // Use exit code 0 for success
		}

		// Extract unique file paths from the array of uncommitted Git files
		const activeGitFilePaths = getUniquePaths(activeGitFiles.map(({ value }) => value));

		// *** todo ***
		// 1. Check if program preferences file (git-commit-prompt.json) exists
		// 2. If it exists, skip this step
		// 3. If not (aka. first time program is run), prompt user to set the program's behaviour via a checklist -> const initProgramConfigs = await promptForInitConfigs();
		// 4. Persist user specified preferences (`initProgramConfigs`)to a config file

		// Check if a preferences file exists
		const preferencesExistChk = await checkFileExists(rootDir, "git-commit-prompt-config.json");

		if (!preferencesExistChk) {
			// If the preferences file does not exist,
			// prompt user to set the program's permanent behaviour via a checklist
			const initProgramConfigs = await promptForInitConfigs();

			console.log({ initProgramConfigs });

			// Persist the preferences to the preferences file
			await persistJsonDataToFile(rootDir, "git-commit-prompt-config.json", initProgramConfigs);
		} else {
			console.log("Preferences file already exists. Skipping configuration prompt.");
		}

		// Initialize the global state, and update it's config property with user preferences
		const globalState = initGlobalState();

		// Update global state properties
		globalState.sessionReadlineInterface = rl;
		globalState.activeGitScopes = [...activeGitFilePaths];

		// Run the main program logic
		await runProgram(globalState);
	} catch (error) {
		// Handle unexpected errors
		console.error(chalk.fail("An unexpected error occurred:", error));
		process.exit(1); // Use exit code 1 for general errors
	}
})();
