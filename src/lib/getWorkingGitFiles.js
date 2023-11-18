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

	const allFiles = [].concat(...changedFilesArr, untrackedFilesArr);

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
