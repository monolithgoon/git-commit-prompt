`use strict`;
const chalk = require("./chalk-messages.js");
const { COMMIT_TYPES_DETAIL } = require("./constants/commit-types.js");

/**
 * Prints a commit message to the console with a stylized format.
 *
 * @param {string} commitMsg - The commit message to print.
 */
function printCommitMessage(commitMsg) {
	console.log((commitMsg));
}

function displayCommitTypes() {
	console.log(chalk.consoleYlow(`Valid commit types:`));
	console.log({ COMMIT_TYPES_DETAIL });
}

module.exports = { printCommitMessage, displayCommitTypes};
