const inquirer = require("inquirer");
const chalk = require("./lib/chalkMessages.js");
const { getWorkingGitFiles } = require("./lib/getWorkingGitFiles.js");

/**
 * Module to handle inquirer prompts for Git-related tasks.
 * @module promptDomainInput
 */

const promptDomainInput = (() => {
	/**
	 * Prompts the user to select a file representing the commit domain.
	 * @async
	 * @function selectGitFile
	 * @returns {Promise<string>} The selected file representing the commit domain.
	 */
	return {
		selectGitFile: async (workingFilesArr) => {
			try {
				// Generate a CLI list of changed + untracked .git files
				if (workingFilesArr.length === 0) {
					console.log(chalk.consoleY("Nothing to commit. Everything up to date."));
					process.exit();
				}

				// Get input from inquirer
				const inquirerResponse = await inquirer.prompt([
					{
						type: "rawlist",
						name: "commit_domain",
						message: chalk.consoleB("Select a file that represents your commit domain"),
						choices: workingFilesArr,
					},
				]);

				// Show user the selection
				console.info(`\n`, chalk.consoleYlow("Selected domain "), chalk.consoleB(inquirerResponse.commit_domain), `\n`);

				// Return the selected file
				return inquirerResponse.commit_domain;
			} catch (error) {
				console.error("Error during inquirer prompt:", error);
			}
		},
	};
})();

module.exports = promptDomainInput;
