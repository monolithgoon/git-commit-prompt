# Git Commit Prompt
## git-commit-prompt.sh

Command line utility to enforce structured git commit messages

![git-commit-prompt-flow](https://github.com/monolithgoon/git-commit-prompt/assets/60096838/9d61edb7-ef79-47e1-b49d-c86d9c08581e)

```bash
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
