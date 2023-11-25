const getGitRepoRootDir = require('./utils/getGitRepoRootDir');
const returnConfig = require('./returnConfig');

const createInterfaceState = (config = {}) => {
  let rootDir;

  try {
    rootDir = getGitRepoRootDir();
  } catch (error) {
    throw new Error('Could not find Git root folder.');
  }

  const cliState = {
    answers: {
      body: '',
      breaking: '',
      issues: '',
      lerna: '',
      scope: '',
      subject: '',
      type: ''
    },
    config: {
      ...returnConfig(rootDir),
      ...config
    },
    rootDir
  };

  return cliState;
};

module.exports = createInterfaceState;
