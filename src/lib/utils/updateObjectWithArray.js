/**
 * Updates the properties of an object with values from an array of updates.
 *
 * @param {Object} originalObj - The original object to be updated.
 * @param {Object[]} updatesArr - An array of update objects.
 */
function updateObjectWithArray(originalObj, updatesArr) {
	// updatesArr => [
	// 	{ allowDevLoggingChk: true },
	// 	{ commitAllFilesChk: true },
	// 	{ pushToOriginChk: true }
	// ]
	updatesArr.forEach((update) => {
		// update => { allowDevLoggingChk: true }
		// Object.keys(update)[0] => "allowDevLoggingChk"
		const key = Object.keys(update)[0]; // Get the key from the update object
		if (originalObj.hasOwnProperty(key)) {
			// Check if the key exists in the original object
			originalObj[key] = update[key]; // Update the value in the original object
		}
	});
}
exports.updateObjectWithArray = updateObjectWithArray;
