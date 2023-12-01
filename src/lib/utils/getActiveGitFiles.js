const { GIT_WORKING_FILE_PATHS } = require("../constants/git_working_file_paths");
const getFileData = require("./getFileData");

/**
 * Processes the input array, removing empty strings.
 *
 * @param {string[]} arr - The input array to be processed.
 * @returns {string[]} The processed array with empty strings removed.
 */
function processArray(arr) {
  return arr.length === 1 && arr[0] === "" ? [] : arr;
}

/**
 * Retrieves the active Git files based on changed, untracked, and staged files.
 *
 * @returns {Object[]} An array of active Git files with keys and values.
 */
function getActiveGitFiles() {
  // Retrieve file data for changed, untracked, and staged files
  const changedFilesArr = processArray(getFileData(GIT_WORKING_FILE_PATHS.changed_files));
  const untrackedFilesArr = processArray(getFileData(GIT_WORKING_FILE_PATHS.untracked_files));
  const stagedFilesArr = processArray(getFileData(GIT_WORKING_FILE_PATHS.staged_files));

  // Combine arrays of changed, untracked, and staged files
  let allFiles = [].concat(...changedFilesArr, ...untrackedFilesArr, ...stagedFilesArr);

  // Get file paths from constants
  const changedFilesPath = (GIT_WORKING_FILE_PATHS.changed_files.match(/temp\/changed-files\.txt$/) || [])[0] || "";
  const untrackedFilesPath = (GIT_WORKING_FILE_PATHS.untracked_files.match(/temp\/untracked-files\.txt$/) || [])[0] || "";
  const stagedFilesPath = (GIT_WORKING_FILE_PATHS.staged_files.match(/temp\/untracked-files\.txt$/) || [])[0] || "";

  // Exclude temp `changed-files.txt` and `untracked-files.txt` files
  allFiles = allFiles.filter((file) => file !== changedFilesPath && file !== untrackedFilesPath);

  // Create an array of active Git files with keys and values
  const activeGitFiles = allFiles.map((item, index) => {
    return {
      key: (index + 1).toString(),
      value: item,
    };
  });

  return activeGitFiles;
}

// Export the function for external use
exports.getActiveGitFiles = getActiveGitFiles;
