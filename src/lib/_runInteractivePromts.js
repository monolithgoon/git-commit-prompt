const inquirer = require("inquirer");
// const AutocompletePrompt = require('inquirer-list-search-prompt');
// const LimitedInputPrompt = require('./LimitedInputPrompt');
const createPrompts = require("./_createPrompts");

// inquirer.registerPrompt('limitedInput', LimitedInputPrompt);
// inquirer.registerPrompt('autocomplete', AutocompletePrompt);

const runInteractivePrompts = async (state, cliAnswers = {}) => {
	// Update the state with inputs from the CMD line
	Object.keys(cliAnswers).forEach((key) => {
		state.commitMsgCategoriesState[key] = cliAnswers[key];
	});

	const questions = createPrompts(state, cliAnswers);
	console.log({ questions });
	const answers = await inquirer.prompt(questions);

	console.log({ answers });

	Object.keys(state.commitMsgCategoriesState).forEach((msgCatState) => {
		if (answers[msgCatState]) {
			state.commitMsgCategoriesState[msgCatState] = answers[msgCatState];
		}
	});

	return answers;
};

module.exports = runInteractivePrompts;
