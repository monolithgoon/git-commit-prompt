const inquirer = require("inquirer");
const chalk = require("./lib/chalkMessages.js");
const { createReadlineInterface } = require("./lib/createReadlineInterface.js");
const { getWorkingGitFiles } = require("./lib/getWorkingGitFiles.js");

const getInquirerInput = (() => {
	return {
		selectGitFile: async () => {
			// *** Sandbox ***
			try {
				// Get array of all un-committed .git files
				const allFilesArray = getWorkingGitFiles();

				// Generate a CLI list of changed + untracked .git files
				if (allFilesArray.length === 0) {
					console.log(chalk.consoleY("Nothing to commit. Everything up to date."));
					process.exit();
				}

				// Get input from inquirer
				const inquirerResponse = await inquirer.prompt([
					{
						type: "rawlist",
						name: "commit_domain",
						message: chalk.consoleB("Select a file that represents your commit domain"),
						choices: allFilesArray,
					},
				]);

				//
				return inquirerResponse.commit_domain;

				// Show user the selection
				console.info(`\n`, chalk.consoleYlow("Selected domain"), chalk.consoleG(promptResponse), `\n`);
			} catch (error) {
				console.error("Error during inquirer prompt:", error);
			}

			// Re-open the readline interface
			// // Purge the contents of the readline buffer to clear the input from Inquirer
			// rl.write(null, { ctrl: true, name: "u" });
			createReadlineInterface();
		},
	};
})();

module.exports = getInquirerInput;
