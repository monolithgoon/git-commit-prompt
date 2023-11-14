`use strict`;
const chalk = require("../chalk-messages.js");

/**
 * Prints a commit message to the console with a stylized format.
 *
 * @param {string} commitMsg - The commit message to print.
 */
function printCommitMessage(commitMsg) {
	console.log((commitMsg));
}

module.exports = { printCommitMessage };
