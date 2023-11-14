// const COMMIT_TYPES_DETAIL = Object.freeze({
// 	1: "FEAT: Used for new features or significant enhancements. For example: `feat: Add user authentication functionality",
// 	2: "FIX: Indicates a commit that fixes a bug or resolves an issue. For example: `fix: Resolve issue with data not being saved",
// 	3: "CHORE: Commits related to maintenance tasks, code cleanup, or general changes that don't fit into other categories. For example: `chore: Refactor code for better readability",
// 	4: "DOCS: Commits related to documentation changes, such as updating comments, README files, or documentation in code. For example: `docs: Update README with installation instructions",
// 	5: "STYLE: Commits that focus on code style, formatting, or code structure changes. For example: `style: Format code according to the project style guide",
// 	6: "REFACTOR: Used for commits that involve code refactoring without changing its external behavior. For example: `refactor: Simplify function parameter handling",
// 	7: "TEST: Commits related to adding or modifying tests, test frameworks, or test data. For example: `test: Add unit tests for the login functionality",
// 	8: "PERF: Commits related to performance improvements. For example: `perf: Optimize database query for faster response times",
// 	9: "BUILD: Commits related to build or CI/CD system configuration and scripts. For example: `build: Update build process to include additional dependencies",
// 	10: "CI: Commits related to continuous integration and continuous deployment (CI/CD) pipeline changes. For example: `ci: Configure CI pipeline for automatic deployment",
// 	11: "REVERT: Indicates that the commit is reverting a previous commit. For example: `revert: Revert changes from commit abc123",
// 	12: "DELETE: Delete a previous commit",
// });
const COMMIT_TYPES_DETAIL = Object.freeze({
	1: "FEAT: Used for new features or significant enhancements",
	2: "FIX: Indicates a commit that fixes a bug or resolves an issue",
	3: "CHORE: Commits related to maintenance tasks, code cleanup, or general changes that don't fit into other categories",
	4: "DOCS: Commits related to documentation changes, such as updating comments, README files, or documentation in code",
	5: "STYLE: Commits that focus on code style, formatting, or code structure changes",
	6: "REFACTOR: Used for commits that involve code refactoring without changing its external behavior",
	7: "TEST: Commits related to adding or modifying tests, test frameworks, or test data",
	8: "PERF: Commits related to performance improvements",
	9: "BUILD: Commits related to build or CI/CD system configuration and scripts",
	10: "CI: Commits related to continuous integration and continuous deployment (CI/CD) pipeline changes",
	11: "REVERT: Indicates that the commit is reverting a previous commit",
	12: "DELETE: Delete a previous commit",
});

const COMMIT_TYPES = Object.freeze({
	1: "test",
	2: "feat",
	3: "refactor",
	4: "style",
	5: "fix",
	6: "chore",
	7: "docs",
	8: "build",
	9: "perf",
	10: "ci",
	11: "revert",
	12: "delete",
});

module.exports = { COMMIT_TYPES_DETAIL, COMMIT_TYPES };