const { readlineQuestionAsync } = require("../utils/readlineQuestionAsync.js");
const { REMOTE_COMMIT_COMMANDS } = require("../constants/remote_commit_commands.js");
const chalk = require("../config/chalkConfig.js");

const validateRemoteGitCommand = async (readLineInterface) => {
	//
	console.table({ REMOTE_COMMIT_COMMANDS });

	const userCommitCommand = await readlineQuestionAsync(
		`Enter the remote commit command:`,
		readLineInterface
	);

	if (Object.values(REMOTE_COMMIT_COMMANDS).includes(userCommitCommand)) {
	} else {
		console.log(
			chalk.consoleYB(
				`Invalid commit command. Please enter a valid commit command from the list: ${Object.values(
					REMOTE_COMMIT_COMMANDS
				).join(", ")}`
			)
		);
		// You can choose to recursively call the function to prompt the user again or handle it in another way
		await validateRemoteGitCommand(readLineInterface);
	}
	return userCommitCommand;
};

exports.validateRemoteGitCommand = validateRemoteGitCommand;
