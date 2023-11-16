const { executeCommitPrompts } = require("./executeCommitPrompts");
const { createReadlineInterface } = require("./lib/createReadlineInterface");
const { displayCommitTypes } = require("./lib/logging");
const { promptUserForLogging } = require("./promptUserForLogging");

(async () => {
	// Create a readline interface to prompt the user for input
	const rl = createReadlineInterface();

	// Prompt the user for logging preference
	const allowDevLoggingChk = await promptUserForLogging(rl);

	// Show allowed commit types to user
	displayCommitTypes();

	// Run the program
	executeCommitPrompts(rl, allowDevLoggingChk);
})();
