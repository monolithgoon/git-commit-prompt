const chalk = require("./lib/config/chalkConfig");
const { runProgram } = require("./main");
const { createReadlineInterface } = require("./lib/utils/createReadlineInterface");
const { promptUserForLogging } = require("./lib/promptUserForLogging");
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

		// Prompt to set the program's behaviour from a checklist
    const runtimeConfigOverrides = await promptForRuntimeConfigs();
    console.log({ runtimeConfigOverrides });

    // Destructure relevant properties from runtimeConfigOverrides
    const { allowDevLoggingChk, commitAllFilesChk, collabWithOriginChk } = runtimeConfigOverrides;

    // Initialize the global state, and update it's config property with user preferences
    const globalState = initGlobalState({ allowDevLoggingChk, commitAllFilesChk, collabWithOriginChk });

    // Update global state properties
    globalState.sessionReadlineInterface = rl;
    globalState.activeGitScopes = [...activeGitFilePaths];

		// Update globalState config obj. without hard-coded destructurinng like above 
    // Note: This line is currently commented; uncomment if needed
    // updateObjectWithArray(globalState.config, runtimeConfigOverrides);

    // Run the main program logic
    await runProgram(globalState);
  } catch (error) {
    // Handle unexpected errors
    console.error(chalk.fail("An unexpected error occurred:", error));
    process.exit(1); // Use exit code 1 for general errors
  }
})();
