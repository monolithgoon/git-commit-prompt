/* eslint-disable import/no-dynamic-require, global-require */
// Disable eslint rules for dynamic require and global require

// const qBody = require('./_prompts/body');
// const qBreaking = require('./_prompts/breaking');
// const qIssues = require('./_prompts/issues');
// const qLerna = require('./_prompts/lerna');
// These lines are commented out, likely unused imports
const promptScope = require("./constants/_prompts/scope-prompt");
const promptType = require("./constants/_prompts/type-prompt");

const promptCreators = {
	// body: qBody,
	// breaking: qBreaking,
	// issues: qIssues,
	// lerna: qLerna,
	scope: promptScope,
	// subject: qSubject,
	type: promptType,
};
// Object mapping different prompt types to their respective modules

const createPrompts = (state, cliAnswers) => {
	// console.log({ state })
	// console.log({ cliAnswers });
	console.log(state.config.promptKeys);

	const prompts = state.config.promptKeys
		// Filter out prompt keys with existing CLI args
		.filter((promptKey) => cliAnswers[promptKey] === undefined)

		.map((promptKey, idx) => {
			console.log({ promptKey, idx });
			const prompt = promptCreators[promptKey].createPrompt(state);

			// **** Todo
			// Set custom messages for prompts if configured
			if (state.config.messages && state.config.messages[promptKey]) {
				prompt.message = state.config.messages[promptKey];
			}

			return prompt;
		});

	// Filter out any undefined prompts before returning
	return prompts.filter(Boolean);
};

module.exports = createPrompts;
