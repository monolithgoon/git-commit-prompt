const fuzzy = require("fuzzy");

const typeToInquirerListItem = ({ commitTypeDetails, disableEmoji }, commitType) => {
	const { description, emoji, value } = commitTypeDetails[commitType];
	const prefix = emoji && !disableEmoji ? emoji + "  " : "";

	return {
		name: prefix.padEnd(4, " ") + (value + ":").padEnd(12, " ") + description,
		value,
	};
};

/**
 * Searches for the type that includes the given substring.
 *
 * @param {string} substring Substring to search with.
 * @param {string[]} config The whole config.
 */
// const findType = function (substring, config) {
// 	const types = config.commitTypesKeys;
// 	console.log({ types });

// 	return Promise.resolve(
// 		fuzzy.filter(substring || "", types).map(({ original: type }) => typeToInquirerListItem(config, type))
// 	);
// };
const findType = function (substring, config) {
	const types = config.commitTypesKeys;
	console.log({ types });

	const filteredTypes = fuzzy.filter(substring || "", types);

	// console.log({ filteredTypes });

	const matchedTypes = filteredTypes.map(({ original: commitType }) => {
		return typeToInquirerListItem(config, commitType);
	});

	// console.log({ matchedTypes });

	return Promise.resolve(matchedTypes);
};

exports.createPrompt = (state) => {
	const { config } = state;
	// console.log({ config });
	const prompt = {
		message: "Select the type of change that you're committing >",
		name: "type",
		// This `_answers` param. seems unused in this particular callback. 
		// It might be a placeholder for answers provided by the user in a larger context but is not utilized in the function body.
		// The user's input during interaction is passed as `filterInput` to this callback function.
		// source: (_answers, filterInput) => findType(filterInput, config),
		source: function (_answers, filterInput) {
			// console.log({ _answers });
			return findType(filterInput, config);
		},
		type: "list-search",
	};

	return prompt;
};
