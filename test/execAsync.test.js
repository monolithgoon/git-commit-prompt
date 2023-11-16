const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { execAsync } = require("../src/execAsync");
chai.use(chaiAsPromised);
const expect = chai.expect;

describe("execAsync function", () => {

	// 1.
	it("should resolve with stdout when the command succeeds", async () => {
		const result = await execAsync(`echo Hello, Mocha`);
		expect(result).to.equal("Hello, Mocha\n");
	});

	// 2.
	it("should reject with an error when the command fails", async () => {
		try {
			await execAsync("nonexistent-command");
			// If the command succeeds, the test should fail
			expect.fail("Expected execAsync to reject but it resolved");
		} catch (error) {
			expect(error).to.be.an("error");
		}
	});

	// 3.
	it("should reject with stderr when the command has stderr output", async () => {
		try {
			await execAsync('echo "Error message" 1>&2');
			// If the command succeeds, the test should fail
			expect.fail("Expected execAsync to reject but it resolved");
		} catch (error) {
			expect(error).to.equal("Error message\n");
		}
	});
});
