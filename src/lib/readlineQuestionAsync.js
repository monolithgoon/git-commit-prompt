const chalk = require("./chalk-messages.js");

/**
 * Asynchronously prompts the user with a question using readline.
 *
 * @param {string} question - The question to ask the user.
 * @param {readline.Interface} rl - The readline interface for user input.
 * @returns {Promise<string>} - A Promise that resolves with the user's input.
 */
function readlineQuestionAsync(question, rl) {
	return new Promise((resolve, reject) => {
		// Ask the user the specified question
		rl.question(chalk.consoleB(question) + " ", (answer) => {
			try {
				// Resolve the promise with the user's input
				resolve(answer);
			} catch (error) {
				// Catch potential errors in the callback
				reject(error);
			}
		});

		// Listen for the 'close' event to ensure the readline interface is closed
		rl.once("close", () => {
			console.log(chalk.interaction("Readline interface closed"));
		});

		// Listen for the 'error' event to catch errors during the question process
		rl.on("error", (error) => {
			// Reject the promise with the error
			reject(error);
			// Ensure readline interface is closed in case of an error
			rl.close();
		});
	});
}

module.exports = { readlineQuestionAsync };
