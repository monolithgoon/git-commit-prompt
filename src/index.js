const chalk = require("./lib/config/chalkConfig");
const fs = require("fs").promises;
const path = require("path");
const getGitRepoRootDir = require("./lib/utils/_getGitRepoRootDir");
const { runProgram } = require("./main");
const { createReadlineInterface } = require("./lib/utils/createReadlineInterface");
const { getActiveGitFiles } = require("./lib/utils/getActiveGitFiles");
const { getUniquePaths } = require("./lib/utils/getUniqueDirectories");
const initGlobalState = require("./lib/_initGlobalState");
const promptForRuntimeConfigs = require("./lib/_runRuntimeConfigPrompts");
const { updateObjectWithArray } = require("./lib/utils/updateObjectWithArray");

// Execute the main functionality in an asynchronous IIFE
(async () => {
	try {
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
		// 3. If not (aka. first time program is run), prompt user to set the program's behaviour via a checklist -> const initProgramConfigs = await promptForRuntimeConfigs();
		// 4. Persist user specified preferences (`initProgramConfigs`)to a config file

		// Check if the preferences file exists
		const preferencesExistChk = await preferencesFileExists();

		if (!preferencesExistChk) {
			// If the preferences file does not exist, prompt for preferences
			const initProgramConfigs = await promptPreferences();

			console.log({ initProgramConfigs });

			// Persist the preferences to the preferences file
			await persistPreferences(initProgramConfigs);
		} else {
			console.log("Preferences file already exists. Skipping configuration prompt.");
		}

		// // Prompt to set the program's behaviour from a checklist
		// const initProgramConfigs = await promptForRuntimeConfigs();
		// console.log({ initProgramConfigs });

		// Initialize the global state, and update it's config property with user preferences
		const globalState = initGlobalState();

		// Update global state properties
		globalState.sessionReadlineInterface = rl;
		globalState.activeGitScopes = [...activeGitFilePaths];

		// *** remove ***
		// Update globalState config obj. without hard-coded destructurinng like above
		// updateObjectWithArray(globalState.config, initProgramConfigs);

		// Run the main program logic
		await runProgram(globalState);
	} catch (error) {
		// Handle unexpected errors
		console.error(chalk.fail("An unexpected error occurred:", error));
		process.exit(1); // Use exit code 1 for general errors
	}
})();

/**
 * Checks if the program preferences file (git-commit-prompt.json) exists.
 * @returns {boolean} True if the preferences file exists, false otherwise.
 */
async function preferencesFileExists() {
	try {
		const rootDir = getGitRepoRootDir();
		// Construct the path to the preferences file
		const preferencesFilePath = path.join(rootDir, "git-commit-prompt-config.json");

		// Check if the file exists
		await fs.access(preferencesFilePath);
		return true;
	} catch (error) {
		// File does not exist
		return false;
	}
}

/**
 * Prompts the user to set the program's behavior via a checklist.
 * @returns {Object} User-specified preferences.
 */
async function promptPreferences() {
	// Prompt user for runtime configurations
	const initProgramConfigs = await promptForRuntimeConfigs();
	return initProgramConfigs;
}

/**
 * Persists user-specified preferences to a preferences file.
 * @param {Object} preferences - User-specified preferences.
 */
async function persistPreferences(preferences) {
	try {
		// Construct the path to the preferences file
		const preferencesFilePath = path.join(__dirname, "git-commit-prompt-config.json");

		// Write the user-specified preferences to the preferences file
		await fs.writeFile(preferencesFilePath, JSON.stringify(preferences, null, 2));

		console.log("User preferences have been successfully saved.");
	} catch (error) {
		console.error("Error saving user preferences:", error);
	}
}
