/**
 * @function mapToBoolean
 * @description Converts yes/y and no/n responses to boolean values.
 * @param {string} response - The user's input response
 * @returns {boolean} - True for yes/y, false for no/n, and null for invalid responses
 */
function mapStringToBoolean(response) {
	const lowercasedResponse = response.toLowerCase();

	if (["yes", "y"].includes(lowercasedResponse)) {
		return true;
	} else if (["no", "n"].includes(lowercasedResponse)) {
		return false;
	} else {
		return null; // Invalid response
	}
}

module.exports = { mapStringToBoolean };
