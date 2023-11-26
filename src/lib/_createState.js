const getGitRepoRootDir = require("./utils/getGitRepoRootDir");
const returnConfig = require("./_returnConfig");

const createInterfaceState = (defaultConfig = {}) => {
	let rootDir;

	try {
		rootDir = getGitRepoRootDir();
	} catch (error) {
		throw new Error("Could not find Git root folder.");
	}

	const cliState = {
		commitMsgCategoriesState: {
			body: ``,
			breaking: ``,
			issues: ``,
			lerna: ``,
			scope: ``,
			subject: ``,
			type: ``,
		},
		config: {
			...returnConfig(rootDir),
			...defaultConfig,
		},
		rootDir,
	};

	return cliState;
};

module.exports = createInterfaceState;
