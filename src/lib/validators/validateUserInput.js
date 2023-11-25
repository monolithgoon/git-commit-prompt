const chalk = require("../config/chalkConfig.js");
const { COMMIT_SUBJECT_TYPES } = require("../constants/commit_subject_types.js");
const { readlineQuestionAsync } = require("../utils/readlineQuestionAsync.js");

/**
 * @function validateUserInput
 * @description This function validates the user's input according to the provided promptMsg flag.
 * @param {string} promptMsg - The message to prompt the user for input
 * @param {readline.Interface} rl - The readline interface object used for user input
 * @param {string} promptFlag - A flag indicating the type of prompt to display,
 *                               either "TYPE", "SCOPE", "MESSAGE", "CONFIRM",
 *                               "AMEND", or "REMOTE"
 * @returns {Promise<string>} - The validated user input as a string
 */

async function validateUserInput(promptMsg, rl, promptFlag) {
	// Prompt the user for input and await the response
	let promptResponse = await readlineQuestionAsync(`${promptMsg}`, rl);

	// Trim empty space from the end of the response
	promptResponse = promptResponse.trim().toLowerCase();

	// Check that the user input is a valid, non-empty string
	if (typeof promptResponse !== "string" || promptResponse.trim() === "") {
		console.log(chalk.consoleYlow(`Response must be a non-empty string`));

		// Recursively call the function until a valid input is received
		promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
	} else {
		// Switch based on the promptFlag
		switch (promptFlag) {
			case "TYPE":

				// Check if the input is at least 2 characters long
				if (promptResponse.length < 2) {
					console.log(chalk.consoleYlow("Commit type must be at least 2 characters long"));
					promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
				}

				// Check if the user's input is a valid commit type
				if (!Object.values(COMMIT_SUBJECT_TYPES).includes(promptResponse.toLowerCase())) {
					console.log(chalk.consoleYlow(`Invalid input. Please enter a correct type:`));
					console.log(COMMIT_SUBJECT_TYPES);
					promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
				}
				break;

			case "SCOPE":
				// Check if the input is at least 3 characters long
				if (promptResponse.length < 3) {
					console.log(chalk.consoleYlow("Commit scope must be at least 3 characters long"));
					promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
				}
				break;

			case "MESSAGE":
				// Check if the input is at least 10 characters long
				if (promptResponse.length < 10) {
					console.log(chalk.consoleYlow("Commit message must be at least 10 characters long"));
					promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
				}
				break;

			case "COMMIT_MESSAGE_OK":
				// Check if the input is a valid confirmation response
				if (!["yes", "y", "no", "n", "quit", "end", "close"].includes(promptResponse.toLowerCase())) {
					console.log(chalk.consoleYlow("Invalid input. Please enter 'Y', 'N', 'END', 'QUIT' or 'CLOSE'"));
					promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
				}
				break;

			case "AMEND":
				// Check if the input is a valid amend type
				if (!["TYPE", "SCOPE", "MESSAGE", "NONE"].includes(promptResponse.toUpperCase())) {
					console.log(chalk.consoleYlow("Invalid input. Please enter 'TYPE', 'SCOPE', 'MESSAGE' or 'NONE'"));
					promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
				}
				break;

			case "YES_NO_RESPONSE":
				// Check if the input is a valid remote response
				if (!["yes", "y", "no", "n"].includes(promptResponse.toLowerCase())) {
					console.log(chalk.consoleYlow("Invalid input. Please enter 'Y' or 'N'"));
					promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
				}
				break;

			default:
				// No specific checks for other promptFlags
				break;
		}
	}
	return promptResponse;
}

module.exports = { validateUserInput };
