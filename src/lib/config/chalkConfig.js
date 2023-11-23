const chalk = require('chalk')

const consoleYlow = chalk.yellow.bold
const consoleB = chalk.blueBright.bold
const consoleGy = chalk.grey.bold
const running = chalk.blue.bgGreenBright.bold
const fail = chalk.white.bgRed.bold
const highlight = chalk.blue.bgYellowBright.bold
const warning  = chalk.whiteBright.bgYellow.bold
const warningStrong  = chalk.redBright.bgYellow.bold

module.exports = {
   consoleYlow,
   consoleB,
   consoleGy,
   running,
   fail,
   highlight,
   warning,
   warningStrong,
}