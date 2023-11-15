const { expect } = require("chai");
const { validateUserInput } = require("../src/lib/validateUserInput");

// Mock readline interface for testing
const rlMock = {
  question: async () => {},
};

describe("validateUserInput", () => {
  it("should validate commit type input", async () => {
    const promptMsg = "Enter commit type:";
    const promptFlag = "TYPE";
    const validInput = "feat";
    const invalidInput = "a";

    // Valid input
    rlMock.question = async () => validInput;
    const result = await validateUserInput(promptMsg, rlMock, promptFlag);
    expect(result).to.equal(validInput);

    // Invalid input (too short)
    rlMock.question = async () => invalidInput;
    const invalidResult = await validateUserInput(promptMsg, rlMock, promptFlag);
    expect(invalidResult).to.not.equal(validInput);
  });

  it("should validate commit domain input", async () => {
    const promptMsg = "Enter commit domain:";
    const promptFlag = "DOMAIN";
    const validInput = "example";
    const invalidInput = "ab";

    // Valid input
    rlMock.question = async () => validInput;
    const result = await validateUserInput(promptMsg, rlMock, promptFlag);
    expect(result).to.equal(validInput);

    // Invalid input (too short)
    rlMock.question = async () => invalidInput;
    const invalidResult = await validateUserInput(promptMsg, rlMock, promptFlag);
    expect(invalidResult).to.not.equal(validInput);
  });

  // Add similar tests for other promptFlags

  // ...

  it("should handle invalid input and retry", async () => {
    const promptMsg = "Enter commit type:";
    const promptFlag = "TYPE";
    const invalidInput = "";

    rlMock.question = async () => invalidInput;
    const result = await validateUserInput(promptMsg, rlMock, promptFlag);
    // Since the input is invalid, it should retry and eventually return a valid result
    expect(result).to.not.equal(invalidInput);
  });
});

