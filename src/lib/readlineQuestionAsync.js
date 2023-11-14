const chalk = require("../chalk-messages.js");

/**
 * Asynchronous function to prompt the user with a question using readline.
 *
 * @param {string} question - The question to display to the user.
 * @param {readline.Interface} rl - The readline interface to use for input.
 * @returns {Promise<string>} A promise that resolves with the user's input.
 * @throws {Error} Throws an error if there is an issue during the question process.
 */
function readlineQuestionAsync(question, rl) {
	return new Promise((resolve, reject) => {
		try {
			// Ask the user the specified question
			rl.question(chalk.consoleB(question) + " ", (answer) => {
				// Resolve the promise with the user's input
				resolve(answer);
			});
		} catch (error) {
			// Catch synchronous errors (e.g., if rl.question throws an error synchronously)
			reject(error);
		}

		// Listen for the 'close' event to ensure the readline interface is closed
		rl.on("close", () => {
			console.log("Readline interface closed.");
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
