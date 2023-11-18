# Git Commit Prompt

### `bash git-commit-prompt.bat`

_`BASH` command line utility to enforce a structured git commit message convention._

This repository follows a structured approach to commit messages to enhance clarity and organization. Each commit message should start with a tag enclosed in square brackets, followed by a brief description.

![git-commit-prompt-flow](https://github.com/monolithgoon/git-commit-prompt/assets/60096838/00533453-5d40-49c5-a336-058fd6967a6e)

## _Pre-set Git Commit Categories_

Here is an overview of the commit message categories:

```javascript
const COMMIT_TYPES_DETAIL = Object.freeze({
	1: "[ build  ]: Related to build or CI/CD system configuration and scripts",
	2: "[ chore  ]: Maintenance tasks, code cleanup, or general changes that don't fit into other categories",
	3: "[ CI     ]: Related to continuous integration and continuous deployment (CI/CD) pipeline changes",
	4: "[ delete ]: Delete a previous commit",
	5: "[ docs   ]: Documentation changes, such as updating comments, README files, or documentation in code",
	6: "[ feat   ]: For new features or significant enhancements",
	7: "[ fix    ]: Fixes a bug or resolves an issue",
	8: "[ perf   ]: Performance improvements",
	9: "[ refactor ]: Commits that involve code refactoring without changing its external behavior",
	10: "[ revert  ]: Indicates that the commit is reverting a previous commit",
	11: "[ style   ]: Tasks that focus on code style, formatting, or code structure changes",
	12: "[ test    ]: Adding or modifying tests, test frameworks, or test data",
});
```
