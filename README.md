# _Git Commit Prompt_

_An interactive command line utility that enforces a structured git commit message convention._

## _Overview_

This module will save you time in 3 ways:

📌 **_Easy Message Formatting_** - The program guides you through setting up commit messages in a consistent way. You don't need to spend time thinking about the format.

```bash
Select the type of change:
1. Feature
2. Bugfix
3. Documentation
...

Enter a short, imperative tense description (max 50 characters):
```

📌 ***Task Tracking Made Simple -*** If your team tracks tasks or issues, the prompt can automatically link commits to these tasks. This means less manual work for you——no need to mention or close tasks in every commit.

```bash
Enter the task/issue number (or leave blank if not applicable):
```

📌 ***Quick Branch and Remote Operations -*** The prompt simplifies common Git tasks like creating branches or pushing changes. It gives developers shortcuts, so they don't have to remember and type out complex commands, saving them time and effort.

```bash
Select an operation:
1. Create a new branch
2. Switch to an existing branch
3. Push changes to a remote
```

## _Usage_

### _Run_

Run the tool using the following command:

```bash
bash git-commit-prompt.bat
```

### _Commit Structure_

```text
[ TAG ] (<SCOPE>) - <MESSAGE>
```

This CLI enforces a strict, opinionated commit message format for clarity, consistency, and organization.  
- **TAG**: Category of change (e.g., `[feat]`, `[fix]`)  
- **SCOPE**: Specific file or directory affected  
- **MESSAGE**: A brief description of the commit  

## _Git Commit Categories_

Outlined below are predefined Git commit message tags, each mapped to a specific category:

| Tag         | Description                                                |
|-------------|------------------------------------------------------------|
| `[build]`   | Build system configuration or CI/CD updates               |
| `[chore]`   | Maintenance, cleanup, or uncategorized changes            |
| `[CI]`      | CI/CD pipeline modifications                              |
| `[delete]`  | Deletions of previous commits                             |
| `[docs]`    | Documentation updates                                     |
| `[feat]`    | New features or major enhancements                        |
| `[fix]`     | Bug fixes or issue resolutions                            |
| `[perf]`    | Performance improvements                                  |
| `[refactor]`| Code refactoring without functional changes               |
| `[revert]`  | Revert a previous commit                                  |
| `[style]`   | Code style, formatting, or structural adjustments         |
| `[test]`    | Add or modify tests, frameworks, or data                  |

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

## _Details_

### _Version_

```bash
0.0.1
```

### _System Diagram_

![git-commit-prompt-sys-diagram](https://github.com/monolithgoon/git-commit-prompt/assets/60096838/331824a1-f4ef-4a47-92c1-5574067c50b5)

### _User Prompt Flow_

![git-commit-prompt-flow](https://github.com/monolithgoon/git-commit-prompt/assets/60096838/00533453-5d40-49c5-a336-058fd6967a6e)

## _Installation_

### _Executables_

The executables encapsulate the Node.js runtime and all other necessary dependencies inside a single binary file.

Download the pre-compiled binaries here:

| Operating System | Supported Versions |
|------------------|--------------------|
| Windows          | Microsoft Windows 10+ |
| Linux            | Ubuntu 20.04+ (x64 and ARM64) |
| macOS            | 11+ (x64 and ARM64) |

---

### _Builds_

To build the tool, you need to have the GNU C++ compiler (`g++`), CMake (`cmake`), and a CMake-supported build system (e.g., GNU Make) installed. OpenMP is optional but supported.

```bash
git clone https://github.com/GIScience/vostok
mkdir vostok_build && cd vostok_build
cmake ../vostok
cmake --build .
```

The resulting executable will reside in your build directory. Use `cmake -G` to generate project files for IDEs if needed.
