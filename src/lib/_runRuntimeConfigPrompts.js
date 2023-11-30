const inquirer = require("inquirer");
// const CheckboxPlusPrompt = require("inquirer-checkbox-plus-prompt");
// inquirer.registerPrompt("checkbox-plus", CheckboxPlusPrompt);
// const runProgramConfigPrompts = async (state) => {
// 	// const prompts = createConfigPrompts(state);
// 	const createConfigPrompt = (state) => {
// 		const prompt = {
// 			message: "Check the following boxes to configure the session behavior >",
// 			name: "checkbox-plus",
// 			source: (_answers, filterInput) => fi,
// 		};
// 	};
// 	console.log({ prompts });
// 	const promptResponses = await inquirer.prompt(prompts);
// 	console.log({ promptResponses });
// };

// module.exports = runProgramConfigPrompts;

// cliOptions.js

// Configuration options for the CLI program
const cliOptions = [
	{
		index: 1,
		name: "allowDevLoggingChk",
		description: "Allow development logging?",
	},
	{
		index: 2,
		name: "commitAllFilesChk",
		description: "Commit all files?",
	},
	{
		index: 3,
		name: "collabWithOriginChk",
		description: "Push commit to remote?",
	},
	// Add more options as needed
];

// cliPrompt.js

/**
 * Prompt the user to select options using checkboxes.
 * @returns {Promise<void>} A Promise that resolves when the user makes selections.
 */
const promptForConfigOptions = async () => {
	// Map configuration options to Inquirer choices
	const choices = cliOptions.map((option) => ({
		name: option.description,
		value: option.name,
	}));

	// Prompt the user to select options
	const selectedOptions = await inquirer.prompt([
		{
			type: "checkbox",
			message: "Select options:",
			name: "options",
			choices,
		},
	]);

	// Log the selected options
	// console.log("Selected options:", selectedOptions.options);
	if (selectedOptions.options.length === 0) return [];
	return selectedOptions.options.map((el) => {
		return {
			[el]: true,
		};
	});
};

module.exports = promptForConfigOptions;
