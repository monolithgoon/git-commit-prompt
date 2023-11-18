const { runProgram } = require("./main");
const { createReadlineInterface } = require("./lib/createReadlineInterface");
const { promptUserForLogging } = require("./promptUserForLogging");
const chalk = require("../src/lib/chalkMessages");
const getFileData = require("./lib/getFileData");
// const { getFileData, readChangedFiles } = require("./lib/getFileData");

/**  */
(async () => {
	const changedFiles = await getFileData(`../../temp/changed-files.txt`);
	const untrackedFiles = await getFileData(`../../temp/untracked-files.txt`);

	console.log({ changedFiles });
	console.log({ untrackedFiles });

	// Create a readline interface to prompt the user for input
	const rl = createReadlineInterface();

	if (!changedFiles && !untrackedFiles) {
		console.log(chalk.yellow("Nothing to commit. Everything up to date."));
		process.exit();
	}
	// Prompt the user for logging preference
	const allowDevLoggingChk = await promptUserForLogging(rl);

	// Run the program
	await runProgram(rl, allowDevLoggingChk);
})();
