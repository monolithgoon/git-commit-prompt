// const chalk = require("./chalk-messages.js");
// const { COMMIT_TYPES } = require("./constants/commit-types.js");
// const { readlineQuestionAsync } = require("./readlineQuestionAsync.js")

// /**
//  * @function validateUserInput
//  * @description This function validates the user's input according to the provided promptMsg flag.
//  * @param {string} promptMsg - The message to promptMsg the user for input
//  * @param {readline.Interface} rl - The readline interface object used for user input
//  * @param {string} promptFlag - A flag indicating the type of promptMsg to display,
//  *                               either "TYPE", "DOMAIN", "MESSAGE", "CONFIRM",
//  *                               "AMEND", or "REMOTE"
//  * @returns {Promise<string>} - The validated user input as a string
//  */

// async function validateUserInput(promptMsg, rl, promptFlag) {

// 	// Prompt the user for input and await the response
// 	let promptResponse = await readlineQuestionAsync(`${promptMsg}`, rl);

// 	// Trim empty space from the end of the response
// 	promptResponse = promptResponse.trim();

// 	// Check that the user input is a valid, non-empty string
// 	if (typeof promptResponse !== "string" || promptResponse.trim() === "") {
// 		console.log(chalk.consoleYlow(`Response must be a non-empty string`));

// 		// Recursively call the function until a valid input is received
// 		promptResponse = validateUserInput(promptMsg, rl, promptFlag);

// 	} else {
// 		switch (promptFlag) {
// 			case "TYPE":
// 				// Check if the input is at least 2 characters long
// 				if (promptResponse.length < 2) {
// 					console.log(chalk.consoleYlow("Commit type must be at least 2 characters long"));
// 					promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
// 				}

// 				// Check if the user's input is a valid commit type
// 				if (!Object.values(COMMIT_TYPES).includes(promptResponse.toLowerCase())) {
// 					console.log(chalk.consoleYlow(`Invalid input. Please enter a correct type:`));
// 					console.log(COMMIT_TYPES);
// 					promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
// 				}
// 				break;

// 			case "DOMAIN":
// 				// Check if the input is at least 3 characters long
// 				if (promptResponse.length < 3) {
// 					console.log(chalk.consoleYlow("Commit domain must be at least 3 characters long"));
// 					promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
// 				}
// 				break;

// 			case "MESSAGE":
// 				// Check if the input is at least 10 characters long
// 				if (promptResponse.length < 10) {
// 					console.log(chalk.consoleYlow("Commit message must be at least 10 characters long"));
// 					promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
// 				}
// 				break;

// 			case "LOCAL COMMIT":
// 				// Check if the input is a valid confirmation response
// 				if (!["yes", "y", "no", "n", "quit", "end", "close"].includes(promptResponse.toLowerCase())) {
// 					console.log(chalk.consoleYlow("Invalid input. Please enter 'Y', 'N', 'END' or 'QUIT'"));
// 					promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
// 				}
// 				break;

// 			case "AMEND":
// 				// Check if the input is a valid amend type
// 				if (!["TYPE", "DOMAIN", "MESSAGE", "NONE"].includes(promptResponse.toUpperCase())) {
// 					console.log(chalk.consoleYlow("Invalid input. Please enter 'TYPE', 'DOMAIN', 'MESSAGE' or 'NONE'"));
// 					promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
// 				}
// 				break;

// 			case "REMOTE":
// 				if (!["yes", "y", "no", "n"].includes(promptResponse.toLowerCase())) {
// 					console.log(chalk.consoleYlow("Invalid input. Please enter 'Y' or 'N'"));
// 					promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
// 				}
// 			default:
// 				// resolve(answer);
// 				break;
// 		}
// 	}
// 	return promptResponse;
// }

// module.exports = { validateUserInput };

const chalk = require("./lib/chalkMessages.js");
const { COMMIT_TYPES } = require("./lib/constants/commit-types.js");
const { readlineQuestionAsync } = require("./lib/readlineQuestionAsync.js");

/**
 * @function validateUserInput
 * @description This function validates the user's input according to the provided promptMsg flag.
 * @param {string} promptMsg - The message to prompt the user for input
 * @param {readline.Interface} rl - The readline interface object used for user input
 * @param {string} promptFlag - A flag indicating the type of prompt to display,
 *                               either "TYPE", "DOMAIN", "MESSAGE", "CONFIRM",
 *                               "AMEND", or "REMOTE"
 * @returns {Promise<string>} - The validated user input as a string
 */

async function validateUserInput(promptMsg, rl, promptFlag) {
	// Prompt the user for input and await the response
	let promptResponse = await readlineQuestionAsync(`${promptMsg}`, rl);

	// Trim empty space from the end of the response
	promptResponse = promptResponse.trim();

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
				if (!Object.values(COMMIT_TYPES).includes(promptResponse.toLowerCase())) {
					console.log(chalk.consoleYlow(`Invalid input. Please enter a correct type:`));
					console.log(COMMIT_TYPES);
					promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
				}
				break;

			case "DOMAIN":
				// Check if the input is at least 3 characters long
				if (promptResponse.length < 3) {
					console.log(chalk.consoleYlow("Commit domain must be at least 3 characters long"));
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

			case "LOCAL COMMIT":
				// Check if the input is a valid confirmation response
				if (!["yes", "y", "no", "n", "quit", "end", "close"].includes(promptResponse.toLowerCase())) {
					console.log(chalk.consoleYlow("Invalid input. Please enter 'Y', 'N', 'END' or 'QUIT'"));
					promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
				}
				break;

			case "AMEND":
				// Check if the input is a valid amend type
				if (!["TYPE", "DOMAIN", "MESSAGE", "NONE"].includes(promptResponse.toUpperCase())) {
					console.log(chalk.consoleYlow("Invalid input. Please enter 'TYPE', 'DOMAIN', 'MESSAGE' or 'NONE'"));
					promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
				}
				break;

			// // REMOVE -> DEPRECATED
			// case "REMOTE":
			// 	// Check if the input is a valid remote response
			// 	if (!["yes", "y", "no", "n"].includes(promptResponse.toLowerCase())) {
			// 		console.log(chalk.consoleYlow("Invalid input. Please enter 'Y' or 'N'"));
			// 		promptResponse = await validateUserInput(promptMsg, rl, promptFlag);
			// 	}
			// 	break;

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
