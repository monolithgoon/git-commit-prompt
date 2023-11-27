const inquirer = require("inquirer");
const ListSearchPrompt = require('inquirer-list-search-prompt');
// const LimitedInputPrompt = require('./LimitedInputPrompt');
const createPrompts = require("./_createPrompts");

// inquirer.registerPrompt('limitedInput', LimitedInputPrompt);
inquirer.registerPrompt('list-search', ListSearchPrompt);

const runInteractivePrompts = async (state, cliAnswers = {}) => {
	// Update the state with inputs from the CMD line
	Object.keys(cliAnswers).forEach((key) => {
		state.commitMsgCategoriesState[key] = cliAnswers[key];
	});

	const prompts = createPrompts(state, cliAnswers);

	console.log({ prompts });

	const responses = await inquirer.prompt(prompts);

	console.log({ responses });

	Object.keys(state.commitMsgCategoriesState).forEach((msgCatState) => {
		if (responses[msgCatState]) {
			state.commitMsgCategoriesState[msgCatState] = responses[msgCatState];
		}
	});

	return responses;
};

module.exports = runInteractivePrompts;
