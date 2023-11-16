const readline = require("readline");

/**
 * Creates a readline interface to prompt the user for input.
 *
 * @returns {Object} - The created readline interface.
 */
function createReadlineInterface() {
	return readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
}
exports.createReadlineInterface = createReadlineInterface;
