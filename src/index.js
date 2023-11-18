const chalk = require("../src/lib/chalkMessages");
const inquirer = require("inquirer");
const { runProgram } = require("./main");
const { createReadlineInterface } = require("./lib/createReadlineInterface");
const { promptUserForLogging } = require("./promptUserForLogging");
const { getWorkingGitFiles } = require("./lib/getWorkingGitFiles");


(() => {

	// Get array of all un-committed .git files
	const allFilesArray = getWorkingGitFiles();

	//
	if (allFilesArray.length === 0) {
		console.log(chalk.consoleY("Nothing to commit. Everything up to date."));
		process.exit();
	}

	inquirer
		.prompt([
			{
				type: "rawlist",
				name: "commit_domain",
				message: chalk.consoleY("Select a file that represents your commit domain"),
				choices: allFilesArray,
			},
		])
		.then(async (answers) => {
			console.info(`\n`, chalk.consoleYlow("Selected domain"), chalk.consoleG(answers.commit_domain), `\n`);

			// Create a readline interface to prompt the user for input
			const rl = createReadlineInterface();

			// Prompt the user for logging preference
			const allowDevLoggingChk = await promptUserForLogging(rl);

			// Run the program
			await runProgram(rl, allowDevLoggingChk);
		});
})();

/**  */
(async () => {
	// // Create a readline interface to prompt the user for input
	// const rl = createReadlineInterface();
	// let changedFiles, untrackedFiles;
	// if (!changedFiles && !untrackedFiles) {
	// 	console.log(chalk.consoleY("Nothing to commit. Everything up to date."));
	// 	process.exit();
	// }
	// // Prompt the user for logging preference
	// const allowDevLoggingChk = await promptUserForLogging(rl);
	// // Run the program
	// await runProgram(rl, allowDevLoggingChk);
})();
