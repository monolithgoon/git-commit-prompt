const fs = require(`fs`);
const path = require(`path`);
const chalk = require("./chalkMessages");

module.exports = (filePath) => {
  try {
    // Read the contents of changed-files.txt synchronously
    const data = fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');

    // Save the contents to a variable
    const content = data.trim().split('\n');

    return content;
  } catch (err) {
    console.error(chalk.consoleYlow('Error reading file:', err.message));
    return null;
  }
};