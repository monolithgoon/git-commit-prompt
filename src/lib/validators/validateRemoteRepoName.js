const { readlineQuestionAsync } = require("../utils/readlineQuestionAsync.js");

const validateRemoteRepoName = async (readLineInterface) => {
	return readlineQuestionAsync(`Enter the name of the remote repo:`, readLineInterface);
};
exports.validateRemoteRepoName = validateRemoteRepoName;
