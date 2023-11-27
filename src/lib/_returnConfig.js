/* eslint-disable global-require, import/no-dynamic-require */
// Disable eslint rules for global require and dynamic require
const path = require("path");
const fs = require("fs");
const signale = require("signale");
const defaultConfig = require("./constants/_default_config");
const USER_COFIG_FILES = require("./constants/_user_config_files");

/**
 * Finds and loads configuration overrides from specified directories.
 *
 * @param {string} [gitRepoRootDir] - The root directory to start searching for configuration files.
 * @returns {Object} - Configuration overrides, if found.
 */
const findConfigOverrides = (gitRepoRootDir) => {
	// Set the current directory to the provided gitRepoRootDir or the current working directory
	const dir = gitRepoRootDir || process.cwd();

	for (const file of USER_COFIG_FILES) {
		// Resolve the absolute path for the current file
		const filename = path.resolve(dir, file);

		// Check if the file exists and is a regular file
		if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
			// If yes, require and return the content of the file as the configuration overrides
			return require(filename);
		}
	}

	// If no config file is found in the current directory, move up to the parent directory
	const parentDir = path.resolve(dir, "..");

	// Check if package.json exists in the current directory
	const pkgFilename = path.join(dir, "package.json");

	if (fs.existsSync(pkgFilename)) {
		try {
			// Try to get the changelog configuration from the package.json file
			const changelog = require(pkgFilename).config.commitizen.changelog;

			// If found, return it as configuration overrides
			if (changelog) {
				return changelog;
			}
			// Handle any errors that might occur during the process
			// (e.g., if the package.json file or its structure is invalid)
			// eslint-disable-next-line no-empty
		} catch (error) {}
	}

	// If no config file or package.json with changelog config is found,
	// recursively search in the parent directory (unless already at the root)
	if (parentDir !== dir) {
		return findConfigOverrides(parentDir);
	}

	// If no overrides are found, return an empty object
	return {};
};

/**
 * Returns the final configuration by merging defaultConfig and any user-determined overrides.
 *
 * @param {string} [gitRepoRootDir] - The root directory to start searching for configuration files.
 * @returns {Object} - Merged configuration.
 */
const returnConfig = (gitRepoRootDir) => {
	// Get configuration overrides
	const userConfigOverrides = findConfigOverrides(gitRepoRootDir);

	// Check if the overrides are of type object
	if (typeof userConfigOverrides !== "object") {
		// If not, log an error and exit the process
		signale.fatal(new TypeError("Expected changelog config to be an object."));

		// eslint-disable-next-line no-process-exit
		process.exit(1);
	}

	// Merge default configuration and overrides
	return {
		...defaultConfig,
		...userConfigOverrides,
	};
};

// Export the returnConfig function as the module's main export
module.exports = returnConfig;
