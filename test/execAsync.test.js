const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { execShellCommand } = require("../src/lib/execShellCommand");
chai.use(chaiAsPromised);
const expect = chai.expect;

describe("execShellCommand function", () => {

	// 1.
	it("should resolve with stdout when the command succeeds", async () => {
		const result = await execShellCommand(`echo Hello, Mocha`);
		expect(result).to.equal("Hello, Mocha\n");
	});

	// 2.
	it("should reject with an error when the command fails", async () => {
		try {
			await execShellCommand("nonexistent-command");
			// If the command succeeds, the test should fail
			expect.fail("Expected execShellCommand to reject but it resolved");
		} catch (error) {
			expect(error).to.be.an("error");
		}
	});

	// 3.
	it("should reject with stderr when the command has stderr output", async () => {
		try {
			await execShellCommand('echo "Error message" 1>&2');
			// If the command succeeds, the test should fail
			expect.fail("Expected execShellCommand to reject but it resolved");
		} catch (error) {
			expect(error).to.equal("Error message\n");
		}
	});
});
