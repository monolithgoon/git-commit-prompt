const format = "{type}{scope}: {emoji}{subject}";

const promptCategoryKeys = [
	"type",
	"scope",
	// 'subject',
	// 'body',
	// 'breaking',
	// 'issues',
	// 'lerna'
];

const commitTypeDetails = {
	chore: {
		description: "Maintenance tasks, code cleanup, or general changes that don't fit into other categories",
		emoji: "🤖",
		value: "chore",
	},
	ci: {
		description: "CI related pipeline changes",
		emoji: "🎡",
		value: "ci",
	},
	docs: {
		description: "Documentation changes, such as adding/updating code comments and/or README files",
		emoji: "✏️",
		value: "docs",
	},
	feat: {
		description: "New features or significant enhancements",
		emoji: "🎸",
		value: "feat",
	},
	fix: {
		description: "Fixes a bug or resolves an issue",
		emoji: "🐛",
		value: "fix",
	},
	perf: {
		description: "Code change that improves performance",
		emoji: "⚡️",
		value: "perf",
	},
	refactor: {
		description: "Code change that neither fixes a bug nor adds a feature",
		emoji: "💡",
		value: "refactor",
	},
	release: {
		description: "Create a release commit",
		emoji: "🏹",
		value: "release",
	},
	style: {
		description: "Markup, white-space, formatting, missing semi-colons...",
		emoji: "💄",
		value: "style",
	},
	test: {
		description: "Adding or modifying tests, test frameworks, or test data",
		emoji: "💍",
		value: "test",
	},
};

// https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type
const commitTypesKeys = ["test", "feat", "fix", "chore", "docs", "refactor", "style", "ci", "perf"];

module.exports = {
	format,
	promptCategoryKeys,
	commitTypeDetails,
	commitTypesKeys,
	allowDevLoggingChk: false,
	commitAllFilesChk: true,
	collabWithOriginChk: true,
	breakingChangePrefix: "🧨 ",
	closedIssueMessage: "Closes: ",
	closedIssuePrefix: "✔ ",
	maxMessageLength: 64,
	minMessageLength: 3,
};
