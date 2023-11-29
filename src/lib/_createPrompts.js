/* eslint-disable import/no-dynamic-require, global-require */
// Disable eslint rules for dynamic require and global require

/**
 * Object mapping different prompt types to their respective modules.
 * @typedef {Object} PromptCreators
 * @property {Function} scope - Function to create a scope prompt.
 * @property {Function} type - Function to create a type prompt.
 */
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

/**
 * Creates an array of prompts based on the state and CLI prompt flags.
 *
 * @function createPrompts
 * @memberof module:PromptCreators
 * @param {Object} state - The state object containing session information.
 * @param {Object} cliPromptFlags - Flags provided through the command line for prompts.
 * @returns {Array<Object>} An array of prompts to be used with Inquirer.
 */
const createPrompts = (state, cliPromptFlags) => {
  // Console logs are left in the code, likely for debugging purposes
  console.log(state.config.promptKeys);

  const prompts = state.config.promptKeys
		// Filter out prompt keys for which CLI args already exist
    .filter((promptKey) => cliPromptFlags[promptKey] === undefined)

    .map((promptKey, idx) => {
      console.log({ promptKey, idx });
      // Get the prompt creator function for the current promptKey
      const promptCreator = promptCreators[promptKey];

      // Create the prompt using the prompt creator function
      const prompt = promptCreator.createPrompt(state);

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

// Export the function for use in other modules
module.exports = createPrompts;
