const fs = require("fs");
const path = require("path");
const { expect } = require("chai");
const readFile = require("../src/lib/getFileData");

describe("readFile", () => {
	it("should read the contents of changed-files.txt and return an array of files", (done) => {
		const filePath = "../../changed-files.txt";

		readFile(filePath)
			.then((files) => {
				// Assuming you have some sample content in changed-files.txt for testing
				const expectedFiles = ["file1.txt", "file2.js", "file3.css"];

				// Perform assertions
				expect(files).to.be.an("array");
				expect(files).to.have.members(expectedFiles);

				done(); // Call done to indicate that the asynchronous operation has completed
			})
			.catch((error) => {
				done(error); // If there's an error, pass it to done to signal a test failure
			});
	});

	it("should handle errors and return null in case of file read failure", (done) => {
		const invalidFilePath = "non-existent-file.txt";

		readFile(invalidFilePath)
			.then((files) => {
				// If the file doesn't exist, it should return null
				expect(files).to.be.null;

				done(); // Call done to indicate that the asynchronous operation has completed
			})
			.catch((error) => {
				done(error); // If there's an error, pass it to done to signal a test failure
			});
	});
});
