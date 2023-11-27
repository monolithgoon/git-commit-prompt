/**
 * The `runWithInteraction` fn. orchestrates the pausing and resuming of Node.js's native readline interface.
 * This enables the integration of Inquirer prompts within the existing flow of execution.
 * By temporarily halting the readline interface, it allows Inquirer to perform its operations undisturbed, ensuring a harmonious coexistence of the native readline and Inquirer functionalities.
 */
exports.pauseResumeReadline = async (rl, runFn, ...args) => {
	rl.pause();
	try {
		return await runFn(...args);
	} catch (error) {
		console.error("An error occurred:", error);
	} finally {
		rl.resume();
	}
};
