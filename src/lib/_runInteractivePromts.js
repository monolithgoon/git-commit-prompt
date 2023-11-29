const inquirer = require("inquirer");
const ListSearchPrompt = require("inquirer-list-search-prompt");
const createPrompts = require("./_createPrompts");

/**
 * Registers the List Search prompt with Inquirer.
 * @name registerListSearchPrompt
 * @function
 * @memberof module:InteractivePrompts
 */
inquirer.registerPrompt("list-search", ListSearchPrompt);

/**
 * Runs interactive prompts using Inquirer to gather user input.
 *
 * @async
 * @function runInteractivePrompts
 * @memberof module:InteractivePrompts
 * @param {Object} state - The state object containing session information.
 * @param {Object} cliAnswers - Answers provided through the command line.
 * @returns {Promise<Object>} A Promise that resolves with the user's prompt responses.
 */
const runInteractivePrompts = async (state, cliAnswers = {}) => {
  // Update the state with inputs from the CMD line
  Object.keys(cliAnswers).forEach((key) => {
    state.promptResponseData[key] = cliAnswers[key];
  });

  // Generate prompts based on the state and CLI answers
  const prompts = createPrompts(state, cliAnswers);

  // Log generated prompts for debugging
  console.log({ prompts });

  // Use Inquirer to prompt the user with the generated prompts
  const promptResponses = await inquirer.prompt(prompts);

  // Log user responses for debugging
  console.log({ promptResponses });

  // Update state with user responses
  Object.keys(state.promptResponseData).forEach((promptCat) => {
    if (promptResponses[promptCat]) {
      state.promptResponseData[promptCat] = promptResponses[promptCat];
    }
  });

  return promptResponses;
};

// Export the function for use in other modules
module.exports = runInteractivePrompts;
