/**
 * Wrapper function for console.log() that logs messages based on environment and logging preferences.
 *
 * @param {string} message - The message to be logged.
 * @param {boolean} allowLogging - Whether logging is allowed or not.
 * @param {string} prodFlag - The environment flag ('development' or 'production').
 */
function logger(message, allowLogging, prodFlag = process.env) {
	// Log messages in 'development' environment only if allowLogging is true
	// Log messages in 'production' environment regardless of the logging preference
	if ((prodFlag === "development" && allowLogging) || prodFlag === "production") {
		console.log({ message });
	}
}

exports.logger = logger;
