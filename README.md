# Git Commit Prompt
_An interactive command line utility that enforces a structured git commit message convention._

##  _Overview_

This module will save you time in 3 ways -
- **_Easy Message Formatting_** - The program guides you through setting up commit messages in a consistent way. You don't need to spend time thinking about the format.

```bash
Select the type of change:
1. Feature
2. Bugfix
3. Documentation
...

Enter a short, imperative tense description (max 50 characters):

```

- ***Task Tracking Made Simple -*** If your team tracks tasks or issues, the prompt can automatically link commits to these tasks. This means less manual work for you——no need to mention or close tasks in every commit.

```bash
Enter the task/issue number (or leave blank if not applicable):
```

- ***Quick Branch and Remote Operations -*** The prompt simplifies common Git tasks like creating branches or pushing changes. It gives developers shortcuts, so they don't have to remember and type out complex commands, saving them time and effort.

```bash
Select an operation:
1. Create a new branch
2. Switch to an existing branch
3. Push changes to a remote
```

## _Details_

### Version
```bash
0.0.1
```

### _Commit Structure_

### `[ TAG ] (<SCOPE>) - <MESSAGE>`

This CLI tool enforces a strict, opinionated approach to commit messages in a way that enhances clarity, consistency and organization for a codebase. Each commit is tagged with a label enclosed in square brackets, signifying the category of change, followed by a `SCOPE` — preferebaly a specific file, but could be a directory — indicating where the major change was made, and finally followed by a brief `MESSAGE` describing the commit.

## _Installation_

### _Executables_

The executables encapsulate the Node.js runtime, and all other necessary dependencies inside a single binary file.

Download the pre-compiled binaries here -

| Operating System |Supported Versions 
|--- |-----------
| Windows | Microsoft Windows 10+
| Linux | Ubuntu 20.04+ (x64 and ARM64)
| macOS | 11+ (x64 and ARM64)

### _Builds_

In order to build VOSTOK, you need to have the GNU C++ compiler (g++), CMake (cmake) and any build system supported by CMake (e.g. GNU make, see all supported generators) installed on your computer. Optionally, VOSTOK may take advantage of OpenMP installed in your system.

To build VOSTOK, create a build directory (CMake prefers out-of-source builds to not clutter up your sources with build artifacts), navigate to it and invoke cmake:

```bash
git clone https://github.com/GIScience/vostok
mkdir vostok_build && cd vostok_build
cmake ../vostok
cmake --build .
```

The resulting executable vostok resides in your build directory. See all supported CMake generators, if you want CMake to generate project files for your favourite IDE (e.g. cmake -G"Visual Studio 12 2013 Win64" ../vostok).

## _Run_

### `bash git-commit-prompt.bat`

## _Pre-set Git Commit Categories_

This outlines a set of Git commit message tags, each associated with a specific category of changes.

For instance, the "[build]" tag relates to configurations and scripts linked to the build or CI/CD system. Maintenance tasks, code cleanup, and general changes that don't fit elsewhere fall under the "[chore]" category. Continuous integration and deployment alterations are captured by the "[CI]" tag.

Deletions of prior commits are denoted by "[delete]", while documentation updates, including comments, README files, or code documentation, are labeled as "[docs]". Introductions of new features or substantial enhancements are marked with "[feat]". Bug fixes or issue resolutions are appropriately tagged with "[fix]". Performance improvements are identified by "[perf]", and commits involving code refactoring without altering external behavior use the "[refactor]" tag.

A commit that reverts a previous change is marked with "[revert]". Tasks focusing on code style, formatting, or structural modifications are assigned the "[style]" label. Lastly, additions or modifications to tests, test frameworks, or test data are categorized under "[test]".

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

### _System Diagram_

![git-commit-prompt-sys-diagram](https://github.com/monolithgoon/git-commit-prompt/assets/60096838/331824a1-f4ef-4a47-92c1-5574067c50b5)

### _User Prompt Flow_

![git-commit-prompt-flow](https://github.com/monolithgoon/git-commit-prompt/assets/60096838/00533453-5d40-49c5-a336-058fd6967a6e)

