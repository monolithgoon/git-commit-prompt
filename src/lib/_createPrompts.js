/* eslint-disable import/no-dynamic-require, global-require */
// const qBody = require('./_prompts/body');
// const qBreaking = require('./_prompts/breaking');
// const qIssues = require('./_prompts/issues');
// const qLerna = require('./_prompts/lerna');
// const qScope = require('./_prompts/scope');
// const qSubject = require('./_prompts/subject');
const promptType = require("./constants/_prompts/type");

const promptCreators = {
	// body: qBody,
	// breaking: qBreaking,
	// issues: qIssues,
	// lerna: qLerna,
	// scope: qScope,
	// subject: qSubject,
	type: promptType,
};

const createPrompts = (state, cliAnswers) => {
	// console.log({ state })
	console.log(state.config.promptKeys);
	console.log({ cliAnswers });
	const prompts = state.config.promptKeys
		.filter((promptKey) => cliAnswers[promptKey] === undefined)
		.map((promptKey, idx) => {
			console.log({ promptKey, idx });
			const prompt = promptCreators[promptKey].createPrompt(state);

			if (state.config.messages && state.config.messages[promptKey]) {
				prompt.message = state.config.messages[promptKey];
			}

			return prompt;
		});

	return prompts.filter(Boolean);
};

module.exports = createPrompts;
