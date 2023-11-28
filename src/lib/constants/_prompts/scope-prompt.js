const fuzzy = require("fuzzy");

const scopeToInquirerListItem = (commitScopes, commitScope) => {
	return {
		name: `${commitScopes.indexOf(commitScope) + 1}) ${commitScope}`,
		value: commitScope,
	};
};

/**
 * Searches for the scopes containing the given substring.
 * @param {string} substring Substring to search with.
 * @param {string[]} scopes Scopes list.
 */
// ***** remove => deprecated
// const findScope = function (substring, scopes) {
// 	// return Promise.resolve(fuzzy.filter(substring || "", scopes).map(({ original: scope }) => scope));
// 	return Promise.resolve(
// 		fuzzy.filter(substring || "", scopes).map(({ original: scope }) => scopeToInquirerListItem(scopes, scope))
// 	);
// };
// ***** remove => deprecated
const findScope = function (substring, scopes) {
	const filteredScopes = fuzzy.filter(substring || "", scopes);
	const matchedScopes = filteredScopes.map(({ original: commitScope }) => {
		return scopeToInquirerListItem(scopes, commitScope);
	});
	// console.log({ matchedScopes });
	return Promise.resolve(matchedScopes);
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
		message: "Select the scope this commit affects >",
		name: "scope",
		source: (_answers, filterInput) => findScope(filterInput, scopesArr),
		type: "list-search",
	};

	return prompt;
};
