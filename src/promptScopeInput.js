const inquirer = require("inquirer");
const chalk = require("./lib/config/chalkConfig.js");

/**
 * Module to handle inquirer prompts for Git-related tasks.
 * @module promptScopeInput
 */

const promptScopeInput = (() => {
	/**
	 * Prompts the user to select a file representing the commit scope.
	 * @async
	 * @function selectGitFile
	 * @returns {Promise<string>} The selected file representing the commit scope.
	 */
	return {
		selectGitFile: async (workingFilesArr) => {
			try {
				// Get input from inquirer
				const inquirerResponse = await inquirer.prompt([
					{
						type: "rawlist",
						name: "commit_domain",
						message: chalk.consoleB("Select a file that represents your commit scope"),
						choices: workingFilesArr,
					},
				]);

				// Show user the selection
				// console.info(`\n`, chalk.consoleYlow("Selected scope "), chalk.consoleB(inquirerResponse.commit_domain), `\n`);

				// Return the selected file
				return inquirerResponse.commit_domain;
			} catch (error) {
				console.error("Error during inquirer prompt:", error);
			}
		},
	};
})();

module.exports = promptScopeInput;
