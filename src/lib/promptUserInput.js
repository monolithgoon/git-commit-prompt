const chalk = require("../chalk-messages.js");
const { COMMIT_TYPES } = require("./constants/commit-types.js");
const { readlineQuestionAsync } = require("./readlineQuestionAsync.js")

/**
 * @function promptUserInput
 * @description This function prompts the user for input using the provided promptMsg message and
 * validates the response according to the provided promptMsg flag.
 * @param {string} promptMsg - The message to promptMsg the user for input
 * @param {readline.Interface} rl - The readline interface object used for user input
 * @param {string} promptFlag - A flag indicating the type of promptMsg to display,
 *                               either "TYPE", "DOMAIN", "MESSAGE", "CONFIRM",
 *                               "AMEND", or "ORIGIN"
 * @returns {Promise<string>} - The validated user input as a string
 */

async function promptUserInput(promptMsg, rl, promptFlag) {
	// Prompt the user for input and await the response
	let promptResponse = await readlineQuestionAsync(`${promptMsg}`, rl);

	// Validate the user input based on the promptMsg flag
	if (typeof promptResponse !== "string" || promptResponse.trim() === "") {
		console.log(chalk.consoleYlow(`Response must be a non-empty string`));

		// Recursively call the function until a valid input is received
		promptResponse = promptUserInput(promptMsg, rl, promptFlag);
	} else {
		switch (promptFlag) {
			case "TYPE":
				// Check if the input is at least 2 characters long
				if (promptResponse.length < 2) {
					console.log(chalk.consoleYlow("Commit type must be at least 2 characters long"));
					promptResponse = await promptUserInput(promptMsg, rl, promptFlag);
				}

				// Check if the user input is a valid commit type pre-set
				if (!Object.values(COMMIT_TYPES).includes(promptResponse.toLowerCase())) {
					console.log(chalk.consoleYlow(`Invalid input. Please enter a correct type:`));
					console.log(COMMIT_TYPES);
					promptResponse = await promptUserInput(promptMsg, rl, promptFlag);
				}
				break;

			case "DOMAIN":
				// Check if the input is at least 3 characters long
				if (promptResponse.length < 3) {
					console.log(chalk.consoleYlow("Commit domain must be at least 3 characters long"));
					promptResponse = await promptUserInput(promptMsg, rl, promptFlag);
				}
				break;

			case "MESSAGE":
				// Check if the input is at least 10 characters long
				if (promptResponse.length < 10) {
					console.log(chalk.consoleYlow("Commit message must be at least 10 characters long"));
					promptResponse = await promptUserInput(promptMsg, rl, promptFlag);
				}
				break;

			case "CONFIRM":
				// Check if the input is a valid confirmation response
				if (!["yes", "y", "no", "n", "quit", "end", "close"].includes(promptResponse.toLowerCase())) {
					console.log(chalk.consoleYlow("Invalid input. Please enter 'Y', 'N', 'END' or 'QUIT'"));
					promptResponse = await promptUserInput(promptMsg, rl, promptFlag);
				}
				break;

			case "AMEND":
				// Check if the input is a valid amend type
				if (!["TYPE", "DOMAIN", "MESSAGE", "NONE"].includes(promptResponse.toUpperCase())) {
					console.log(chalk.consoleYlow("Invalid input. Please enter 'TYPE', 'DOMAIN', 'MESSAGE' or 'NONE'"));
					promptResponse = await promptUserInput(promptMsg, rl, promptFlag);
				}
				break;

			case "ORIGIN":
				if (!["yes", "y", "no", "n"].includes(promptResponse.toLowerCase())) {
					console.log(chalk.consoleYlow("Invalid input. Please enter 'Y' or 'N'"));
					promptResponse = await promptUserInput(promptMsg, rl, promptFlag);
				}
			default:
				// resolve(answer);
				break;
		}
	}
	return promptResponse;
}

module.exports = { promptUserInput };
