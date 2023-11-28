const { GIT_WORKING_FILE_PATHS } = require("../constants/git_working_file_paths");
const getFileData = require("./getFileData");

function processArray(arr) {
	return arr.length === 1 && arr[0] === "" ? [] : arr;
}

function getActiveGitFiles() {
	//
	const changedFilesArr = processArray(getFileData(GIT_WORKING_FILE_PATHS.changed_files));
	const untrackedFilesArr = processArray(getFileData(GIT_WORKING_FILE_PATHS.untracked_files));

	// Array of all changed files
	let allFiles = [].concat(...changedFilesArr, untrackedFilesArr);

	// Get file paths from constants
	let changedFilesPath = (GIT_WORKING_FILE_PATHS.changed_files.match(/temp\/changed-files\.txt$/) || [])[0] || "";
	let untrackedFilesPath = (GIT_WORKING_FILE_PATHS.untracked_files.match(/temp\/untracked-files\.txt$/) || [])[0] || "";

	// Always exclude the temp `changed-files.txt` and `untracked-files.txt` files
	allFiles = allFiles.filter((file) => file !== changedFilesPath && file !== untrackedFilesPath);

	const activeGitFiles = allFiles.map((item, index) => {
		return {
			key: (index + 1).toString(),
			value: item,
		};
	});

	return activeGitFiles;
}

exports.getActiveGitFiles = getActiveGitFiles;
