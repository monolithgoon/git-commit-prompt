const chalk = require("../src/chalk-messages.js");
const { execAsync, readlineQuestionAsync } = require("../src/lib/lib.js");

describe("execAsync()", () => {
	test("should return stdout when the command is executed successfully", async () => {
		const result = await execAsync('echo "Hello, World!"');
		expect(result).toBe("Hello, World!\n");
	});

	test("should throw an error when the command execution fails", async () => {
		await expect(execAsync("invalid-command")).rejects.toThrow();
	});
});

// FIXME > NOT WORKING PROPERLY
// describe("readlineQuestionAsync", () => {
// 	test("should resolve with the user input", async () => {
// 		// Mock readline interface
// 		const mockQuestion = "What is your name?";
// 		const mockAnswer = "John Doe";

// 		// Create a mock readline interface
// 		const rl = {
// 			question: jest.fn().mockImplementationOnce((question, callback) => {
// 				expect(question).toBe(chalk.consoleB(mockQuestion) + " ");
// 				callback(mockAnswer);
// 			}),
// 		};

// 		// Call the function with the mock readline interface
// 		const result = await readlineQuestionAsync(mockQuestion, rl);

// 		// Expectations
// 		expect(result).toBe(mockAnswer);
// 		expect(rl.question).toHaveBeenCalled();
// 	});

// 	test("should reject if readline encounters an error", async () => {
// 		// Mock readline interface
// 		const mockQuestion = "What is your name?";
// 		const mockError = new Error("Readline error");

// 		// Create a mock readline interface
// 		const rl = {
// 			question: jest.fn().mockImplementationOnce((question, callback) => {
// 				expect(question).toBe(chalk.consoleB(mockQuestion) + " ");
// 				// Call the callback with an error to simulate an error during readline
// 				callback(mockError);
// 			}),
// 			on: jest.fn().mockImplementationOnce((event, callback) => {
// 				// Simulate the 'error' event
// 				if (event === "error") {
// 					callback(mockError);
// 				}
// 			}),
// 			close: jest.fn(), // Mock the close method
// 		};

// 		// Call the function with the mock readline interface
// 		await expect(readlineQuestionAsync(mockQuestion, rl)).rejects.toEqual(mockError);

// 		// Expectations
// 		expect(rl.question).toHaveBeenCalled();
// 		expect(rl.close).toHaveBeenCalled(); // Ensure that close method is called
// 	});
// });
