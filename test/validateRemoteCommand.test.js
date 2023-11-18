const sinon = require("sinon");
const chai = require("chai");
const { expect } = chai;
const { exeGitCommand } = require("../src/exeGitCommand");

describe("exeGitCommand", () => {
	it("should commit changes to a remote repository successfully", async () => {
		const remoteCommand = "push"; // Change this based on your use case
		const remoteRepoName = "origin";
		const remoteBranchName = "master";
		const readlineInterface = {}; // You can create a mock for readline interface if needed

		// Mock the execAsync function
		const execAsyncStub = sinon.stub().resolves("Success response");

		// Replace the actual execAsync function with the stub
		sinon.replace(require("../src/lib/execAsync"), "execAsync", execAsyncStub);

		try {
			await exeGitCommand(readlineInterface, remoteCommand, {
				remoteRepoName: remoteRepoName,
				remoteBranchName: remoteBranchName,
			});

			// Verify that execAsync was called with the correct arguments
			sinon.assert.calledWithExactly(
				execAsyncStub,
				`git ${remoteCommand} ${remoteRepoName} ${remoteBranchName}`,
				readlineInterface
			);
		} finally {
			// Restore the original execAsync function
			sinon.restore();
		}
	});

	it("should throw an error if the commit fails", async () => {
		const remoteCommand = "push"; // Change this based on your use case
		const remoteRepoName = "origin";
		const remoteBranchName = "master";
		const readlineInterface = {}; // You can create a mock for readline interface if needed

		// Mock the execAsync function to throw an error
		const execAsyncStub = sinon.stub().rejects(new Error("Commit failed"));

		// Replace the actual execAsync function with the stub
		sinon.replace(require("../src/lib/execAsync"), "execAsync", execAsyncStub);

		try {
			await expect(
				exeGitCommand(readlineInterface, remoteCommand, { remoteRepoName, remoteBranchName })
			).to.be.rejectedWith("Commit failed");
		} finally {
			// Restore the original execAsync function
			sinon.restore();
		}
	});
});
