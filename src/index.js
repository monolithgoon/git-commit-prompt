const { runProgram } = require("./main");
const { createReadlineInterface } = require("./lib/createReadlineInterface");
const { promptUserForLogging } = require("./promptUserForLogging");

(async () => {
	// Create a readline interface to prompt the user for input
	const rl = createReadlineInterface();

	// Prompt the user for logging preference
	const allowDevLoggingChk = await promptUserForLogging(rl);

	// Run the program
	runProgram(rl, allowDevLoggingChk);
})();
