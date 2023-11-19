const chalk = require("./chalkMessages");
const getFileData = require("./getFileData");

function processArray(arr) {
	return arr.length === 1 && arr[0] === "" ? [] : arr;
}

const FILE_PATHS = {
	changed_files: `../../temp/changed-files.txt`,
	untracked_files: `../../temp/untracked-files.txt`,
};

function getWorkingGitFiles() {
	//
	const changedFilesArr = processArray(getFileData(FILE_PATHS.changed_files));
	const untrackedFilesArr = processArray(getFileData(FILE_PATHS.untracked_files));

	// Array of all changed files
	let allFiles = [].concat(...changedFilesArr, untrackedFilesArr);

	// Get file paths from constants
	let changedFilesPath = (FILE_PATHS.changed_files.match(/temp\/changed-files\.txt$/) || [])[0] || "";
	let untrackedFilesPath = (FILE_PATHS.untracked_files.match(/temp\/untracked-files\.txt$/) || [])[0] || "";

	// Exclude the changed-files.txt and untracked-files.txt
	allFiles = allFiles.filter((file) => file !== changedFilesPath && file !== untrackedFilesPath);

	const allFilesArray = allFiles.map((item, index) => {
		return {
			key: (index + 1).toString(),
			value: item,
		};
	});

	//
	if (allFilesArray.length === 0) {
		console.log(chalk.consoleY("Nothing to commit. Everything up to date."));
		process.exit();
	}

	return allFilesArray;
}

exports.getWorkingGitFiles = getWorkingGitFiles;
