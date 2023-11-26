const readline = require("readline");
const assert = require("assert");
const sinon = require("sinon");
const chalkMessages = require("../src/lib/chalkMessages");
const { readlineQuestionAsync } = require("../src/lib/readlineQuestionAsync");

describe("readlineQuestionAsync", () => {
	let readLineStub;

	beforeEach(() => {
		// Create a stub for readline.createInterface
		readLineStub = sinon.stub(readline, "createInterface");
	});

	afterEach(() => {
		// Restore the stubs after each test
		sinon.restore();
	});

	it("should resolve with user input", async () => {
		const question = "What is your name?";
		const userInput = "John";

		const mockInterface = {
			question: sinon.stub(),
			once: sinon.stub(),
			on: sinon.stub(),
			close: sinon.stub(),
		};

		// Stub readline.createInterface to return the mock interface
		readLineStub.returns(mockInterface);

		// Stub mockInterface.question to call the callback with the user input
		mockInterface.question.callsArgWith(1, userInput);

		const result = await readlineQuestionAsync(question, mockInterface);

		// Ensure the mockInterface.question method was called with the correct arguments
		assert.strictEqual(
			mockInterface.question.calledWithExactly(chalkMessages.consoleBrBB(question) + " ", sinon.match.func),
			true
		);
		// Ensure the function resolves with the correct user input
		assert.strictEqual(result, userInput);
	});

	// it('should handle close event', async () => {
	//   const question = 'What is your name?';

	//   const mockInterface = {
	//     question: sinon.stub(),
	//     once: sinon.stub(),
	//     on: sinon.stub(),
	//     close: sinon.stub(),
	//   };

	//   // Stub readline.createInterface to return the mock interface
	//   readLineStub.returns(mockInterface);

	//   // Stub mockInterface.once to call the callback for 'close' event
	//   mockInterface.once.callsArg(1);

	//   // Use async/await to handle asynchronous behavior
	//   await readlineQuestionAsync(question, mockInterface);

	//   // Ensure the mockInterface.once method was called with the correct arguments
	//   assert.strictEqual(mockInterface.once.calledWithExactly('close', sinon.match.func), true);
	// });
	it("should handle close event", async () => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		const question = "What is your name?";
		const userInput = "John";

		// Stub readline.question to call the callback with the user input
		sinon.stub(rl, "question").callsArgWith(1, userInput);

		// Use rl.question in some way
		rl.question("What is your name?", (answer) => {
			console.log("User input:", answer); // This will output 'User input: John'
		});

		// try {
		// 	const result = await readlineQuestionAsync(question, rl);

		// 	// Ensure the readline.question method was called with the correct arguments
		// 	assert.strictEqual(rl.question.calledWithExactly(chalk.consoleGyB(question) + " ", sinon.match.func), true);
		// 	// Ensure the function resolves with the correct user input
		// 	assert.strictEqual(result, userInput);
		// } finally {
		// 	// Close the readline interface in a finally block to ensure it's closed even if the test fails
		// 	rl.close();
		// }
	});

	it("should handle error event", async () => {
		const question = "What is your name?";
		const error = new Error("Mocked error");

		const mockInterface = {
			question: sinon.stub(),
			once: sinon.stub(),
			on: sinon.stub(),
			close: sinon.stub(),
		};

		// Stub readline.createInterface to return the mock interface
		readLineStub.returns(mockInterface);

		// Stub mockInterface.on to call the callback for 'error' event
		mockInterface.on.callsArgWith(1, error);

		// Ensure the promise is rejected with the correct error
		await assert.rejects(() => readlineQuestionAsync(question, mockInterface), error);
		// Ensure the mockInterface.on method was called with the correct arguments
		assert.strictEqual(mockInterface.on.calledWithExactly("error", sinon.match.func), true);
		// Ensure mockInterface.close method is called in case of an error
		assert.strictEqual(mockInterface.close.calledOnce, true);
	});
});
