const fuzzy = require("fuzzy");

/**
 * Searches for the scopes containing the given substring.
 *
 * @param {string} substring Substring to search with.
 * @param {string[]} scopes Scopes list.
 */
const findScope = function (substring, scopes) {
	return Promise.resolve(fuzzy.filter(substring || "", scopes).map(({ original: scope }) => scope));
};

exports.createPrompt = (state) => {
	const { activeGitScopes } = state;
	console.log({ activeGitScopes });

	if (!activeGitScopes) {
		return null;
	}

	if (!Array.isArray(activeGitScopes)) {
		throw new TypeError("Scopes must be an array of strings.");
	}

	if (activeGitScopes.length < 1) {
		return null;
	}

	// activeGitScopes: [
	// 	{ key: "1", value: "src/" },
	// 	{ key: "2", value: "src/getUniqueDirectories.js" },
	// ];
	// convert activeGitScopes from objects to plain arr. of strings
	const scopesArr = activeGitScopes.map((el) => el.value);

	const prompt = {
		message: "Select the scope this commit affects:",
		name: "scope",
		source: (_answers, filterInput) => findScope(filterInput, scopesArr),
		type: "list-search",
	};

	return prompt;
};
