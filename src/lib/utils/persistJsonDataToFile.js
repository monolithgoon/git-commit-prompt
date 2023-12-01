const path = require("path");
const { fs } = require("../..");

/**
 * Persists user-specified preferences to a preferences file.
 * @param {Object} preferences - User-specified preferences.
 */

async function persistJsonDataToFile(rootDir, fileName, data) {
	try {
		// Construct the path to the preferences file
		const preferencesFilePath = path.join(rootDir, fileName);

		// Write the user-specified preferences to the preferences file
		await fs.writeFile(preferencesFilePath, JSON.stringify(data, null, 2));

		console.log("User preferences have been successfully saved.");
	} catch (error) {
		console.error("Error saving user preferences:", error);
	}
}
exports.persistJsonDataToFile = persistJsonDataToFile;
