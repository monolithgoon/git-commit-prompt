const getGitRepoRootDir = require("./utils/_getGitRepoRootDir");
const returnConfig = require("./_returnConfig");

const initGlobalState = (defaultConfig = {}) => {
  let rootDir;
  let sessionReadlineInterface = null;

  try {
    // Attempt to find the Git root folder
    rootDir = getGitRepoRootDir();
  } catch (error) {
    // Throw an error if the Git root folder is not found
    throw new Error(`Could not find Git root folder. ${error.message}`);
  }

  // Define the initial state of the global configuration
  const globalState = {
		sessionReadlineInterface,
    promptResponseData: {
      // Initial values for prompt response data
      body: ``,
      breaking: ``,
      issues: ``,
      lerna: ``,
      scope: ``,
      subject: ``,
      type: ``,
    },
    // Active Git scopes initially set to an empty array
    activeGitScopes: [],
    config: {
      // Merge the configuration from returnConfig and defaultConfig
      ...returnConfig(rootDir),
      ...defaultConfig,
    },
    // Set the Git root directory and readline interface
    rootDir,
  };

  return globalState;
};

module.exports = initGlobalState;
