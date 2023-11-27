const getGitRepoRootDir = require("./utils/_getGitRepoRootDir");
const returnConfig = require("./_returnConfig");

const createGlobalState = (defaultConfig = {}) => {
	let rootDir;

	try {
		rootDir = getGitRepoRootDir();
	} catch (error) {
		throw new Error("Could not find Git root folder.");
	}

	const globalState = {
		promptResponseData: {
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

	return globalState;
};

module.exports = createGlobalState;
