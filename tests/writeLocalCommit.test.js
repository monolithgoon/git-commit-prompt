const readline = require("readline");
const chalk = require("../src/lib/chalk-messages");
const { writeLocalCommit } = require("../src/lib/writeLocalCommit"); // Update with the correct module path
const { execAsync } = require("../src/lib/execAsync");
const { printCommitMessage } = require("../src/lib/logger");

jest.mock("../src/lib/execAsync"); // Mocking execAsync
jest.mock("../src/lib/logger"); // Mocking printCommitMessage

describe("writeLocalCommit", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("successfully writes a local commit", async () => {
		const commitMsg = "Test commit message";


		// Create a readline interface using the readable stream
		const readLineInterface = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		// Mock the execAsync function to return a successful response
		execAsync.mockResolvedValue("Commit successful");

		// Call the function
		await writeLocalCommit(commitMsg, readLineInterface);

		// Assertions
		expect(console.log).toHaveBeenCalledWith(("Writing local commit .."));
		expect(execAsync).toHaveBeenCalledWith("git add -A && git commit -m Test commit message", readLineInterface);
		expect(console.log).toHaveBeenCalledWith(("Local commit write successful"));
		expect(printCommitMessage).toHaveBeenCalledWith("Commit successful");
	});

	// test("handles error when writing local commit fails", async () => {
	// 	const commitMsg = "Test commit message";

	// 	// Create a readable stream for readline
	// 	const rlStream = new PassThrough();

	// 	// Create a readline interface using the readable stream
	// 	const readLineInterface = readline.createInterface({
	// 		input: rlStream,
	// 		output: process.stdout,
	// 	});

	// 	// Mock the execAsync function to throw an error
	// 	execAsync.mockRejectedValue(new Error("Commit failed"));

	// 	// Assertions
	// 	await expect(writeLocalCommit(commitMsg, readLineInterface)).rejects.toThrow("Local commit write failed");
	// 	expect(console.error).toHaveBeenCalledWith(chalk.warningStrong(new Error("Commit failed")));
	// });
});
