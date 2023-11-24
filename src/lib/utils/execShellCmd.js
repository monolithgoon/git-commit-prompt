const { exec } = require("child_process");

/**
 * Executes a shell command asynchronously and returns a Promise.
 *
 * The execShellCmd() function is a utility function that wraps the `exec()` method from the `child_process` module in Node.js and returns a promise.
 * This allows you to execute shell commands asynchronously in a more structured and predictable way.
 * The function takes two arguments: `command` and `rl`. The `command` argument is a string that specifies the shell `command` to be executed.
 *
 * @param {string} command - The shell command to execute.
 * @param {object} rl - The readline interface for user input.
 * @returns {Promise<string>} A Promise that resolves with the command's standard output or rejects with an error or standard error.
 */
function execShellCmd(command, rl) {
	/**
	 * @type {Promise<string>}
	 */
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error);
			} else if (stderr) {
				console.log({ stderr });
				reject(stderr);
			} else {
				console.log({ stdout });
				resolve(stdout);
			}
		});
	});
	// Ensure the readline interface is closed regardless of success or failure.
	// .finally(() => {
	// 	rl && rl.pause();
	// })
}

module.exports = { execShellCmd };
