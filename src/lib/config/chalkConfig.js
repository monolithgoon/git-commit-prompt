const chalk = require("chalk");

const consoleYB = chalk.yellow.bold;
const consoleBrBB = chalk.blueBright.bold;
const consoleGyB = chalk.grey.bold;
const fail = chalk.white.bgRed.bold;
const highlight = chalk.blue.bgYellowBright.bold;
const warning = chalk.whiteBright.bgYellow.bold;
const warningStrong = chalk.redBright.bgYellow.bold;

module.exports = {
	consoleYB,
	consoleBrBB,
	consoleGyB,
	fail,
	highlight,
	warning,
	warningStrong,
};
