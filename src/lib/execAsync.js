const { exec } = require("child_process");

/**
 * The execAsync() function is a utility function that wraps the `exec()` method from the `child_process` module in Node.js and returns a promise.
 * This allows you to execute shell commands asynchronously in a more structured and predictable way.
 * The function takes two arguments: `command` and `rl`. The `command` argument is a string that specifies the shell `command` to be executed.
 * The `rl` argument is an optional readline interface that can be closed if the `command` execution fails.
 */
function execAsync(command, rl) {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error);
				if (rl) {
					rl.close();
				}
			} else if (stderr) {
				reject(stderr);
				if (rl) {
					rl.close();
				}
			} else {
				resolve(stdout);
			}
		});
	});
}
module.exports = { execAsync };
