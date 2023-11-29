const inquirer = require("inquirer");
const runProgramConfigPrompts = async (state) => {
	const prompts = createConfigPrompts(state);
	console.log({ prompts });
	const promptResponses = await inquirer.prompt(prompts);
	console.log({ promptResponses });
};

module.exports = runProgramConfigPrompts;
