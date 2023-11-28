const pkg = require("../../../package.json");
exports.HELP_SCREEN = `
    ${pkg.description}

    Usage: git-commit-prompt [options]

    options:
        -h, --help          show usage information
        -v, --version       print version info and exit
        --disable-emoji     don't add emoji to commit title
        --format            custom formatting options for subject
        --non-interactive   run git-cz in non-interactive mode

    non-interactive mode options:
        --type              type of the commit, defaults to "chore"
        --subject           message of the commit, defaults to "automated commit"
        --scope             semantic commit scope
        --body              extended description of the commit
        --breaking          description of breaking changes, if any
        --issues            GitHub issues this commit closed, e.g "#123"
        --lerna             Lerna mono-repo packages this commit affects
`;