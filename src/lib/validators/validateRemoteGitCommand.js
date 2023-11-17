const { readlineQuestionAsync } = require("../readlineQuestionAsync.js");
const { COMMIT_COMMANDS } = require("../constants/commit_commands.js");
const chalk = require("../chalkMessages.js");

const validateRemoteGitCommand = async (readLineInterface) => {
	//
	console.log({ COMMIT_COMMANDS });

	const userCommitCommand = await readlineQuestionAsync(
		`Enter the commit command (1: build, 2: chore, 3: test, etc.):`,
		readLineInterface
	);

	if (Object.values(COMMIT_COMMANDS).includes(userCommitCommand)) {
	} else {
		console.log(
			chalk.consoleYlow(
				`Invalid commit command. Please enter a valid commit command from the list: ${Object.values(
					COMMIT_COMMANDS
				).join(", ")}`
			)
		);
		// You can choose to recursively call the function to prompt the user again or handle it in another way
		await validateRemoteGitCommand(readLineInterface);
	}
	return userCommitCommand;
};

exports.validateRemoteGitCommand = validateRemoteGitCommand;
