const inquirer = require("inquirer");
const ListSearchPrompt = require("inquirer-list-search-prompt");
// const LimitedInputPrompt = require('./LimitedInputPrompt');
const createPrompts = require("./_createPrompts");

// inquirer.registerPrompt('limitedInput', LimitedInputPrompt);
inquirer.registerPrompt("list-search", ListSearchPrompt);

const runInteractivePrompts = async (state, cliAnswers = {}) => {
	// Update the state with inputs from the CMD line
	Object.keys(cliAnswers).forEach((key) => {
		state.promptResponseData[key] = cliAnswers[key];
	});

	const prompts = createPrompts(state, cliAnswers);

	console.log({ prompts });

	const promptResponses = await inquirer.prompt(prompts);

	console.log({ promptResponses });

	Object.keys(state.promptResponseData).forEach((promptCat) => {
		// console.log({ promptCat });
		// console.table(promptResponses[`${promptCat}`]);

		if (promptResponses[promptCat]) {
			state.promptResponseData[promptCat] = promptResponses[promptCat];
		}
	});

	return promptResponses;
};

module.exports = runInteractivePrompts;
