const path = require("path");
const { fs } = require("../..");

/**
 * Checks if the program preferences file (git-commit-prompt.json) exists.
 * @returns {boolean} True if the preferences file exists, false otherwise.
 */

async function checkFileExists(rootDir, fileName) {
	try {
		// Construct the path to the preferences file
		const preferencesFilePath = path.join(rootDir, fileName);

		// Check if the file exists
		await fs.access(preferencesFilePath);
		return true;
	} catch (error) {
		// File does not exist
		return false;
	}
}
exports.checkFileExists = checkFileExists;
