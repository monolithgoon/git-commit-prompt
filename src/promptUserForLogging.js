const { validateUserInput } = require("./lib/validators/validateUserInput");

/**
 * Prompts the user to allow logging or not.
 *
 * @param {Object} readLineInterface - The readline interface for user input.
 * @returns {Promise<boolean>} - Resolves with true if logging is allowed, false otherwise.
 */

async function promptUserForLogging(readLineInterface) {
	try {
		const allowLogging = await validateUserInput("Do you want to allow logging in development mode? (yes / no):", readLineInterface);
		return allowLogging.toLowerCase() === "yes";
	} catch (error) {
		console.error(`Error while prompting for logging preference: ${error}`);
		return false;
	}
}

exports.promptUserForLogging = promptUserForLogging;
