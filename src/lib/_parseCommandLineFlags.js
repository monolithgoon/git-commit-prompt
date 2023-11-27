/* eslint-disable no-process-exit */
/* eslint-disable no-console */
/* eslint-disable id-length */
const minimist = require("minimist");
const { HELP_SCREEN } = require("./constants/_help_screen");

/**
 * Parses command-line arguments using the minimist library.
 * @returns {{
 *   commandLineAnswers: object,
 *   commandLineOptions: object,
 *   remainingParams: object
 * }}
 */
const parseCommandLineFlags = () => {
	// The use of _: freeArgs is specific to the minimist library and captures the positional or free arguments directly. 
	// On the other hand, ...otherUnspecifiedArgs collects any additional parameters that were not explicitly destructured into individual variables.
	const {
		// eslint-disable-next-line no-unused-vars
		_: unspecifiedArgs,
		"dry-run": dryRun,
		hook,
		"disable-emoji": disableEmoji,
		format,
		"non-interactive": nonInteractive,
		body,
		breaking,
		issues,
		lerna,
		scope,
		subject,
		type,
		help,
		h,
		version,
		v,
		...otherUnspecifiedArgs
	} = minimist(process.argv.slice(2), {
		alias: {
			h: "help",
			v: "version",
		},
		boolean: ["version", "help", "disable-emoji", "non-interactive", "hook", "dry-run"],
		string: ["format", "type", "subject", "scope", "body", "breaking", "issues", "learna"],
	});

	if (help || h) {
		console.log(HELP_SCREEN);
		process.exit();
	}

	if (version || v) {
		console.log(pkg.version);
		process.exit();
	}

	// Parsed command-line options for configuring the program session
	const cliConfigFlags = {
		disableEmoji,
		dryRun,
		format,
		help,
		hook,
		nonInteractive,
		version,
	};

	// Parsed command-line prompt flags for using using the program in a non-interactive way
	const cliPromptFlags = {
		body,
		breaking,
		issues,
		lerna,
		scope,
		subject,
		type,
	};

	return {
		cliConfigFlags,
		cliPromptFlags,
		otherUnspecifiedArgs,
	};
};

module.exports = parseCommandLineFlags;
