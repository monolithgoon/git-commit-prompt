const { exec } = require('child_process');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { execAsync } = require('../src/execAsync');

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('execAsync function', () => {
  it('should resolve with stdout when the command is successful', async () => {
    const mockStdout = 'Command executed successfully';
    exec.yields(null, mockStdout, null);

    const result = await execAsync('mock command');
    expect(result).to.equal(mockStdout);
  });

  it('should reject with an error when the command fails', async () => {
    const mockError = new Error('Command failed');
    exec.yields(mockError, null, null);

    await expect(execAsync('mock command')).to.be.rejectedWith(mockError);
  });

  it('should reject with stderr when there is an error', async () => {
    const mockStderr = 'Error occurred';
    exec.yields(null, null, mockStderr);

    await expect(execAsync('mock command')).to.be.rejectedWith(mockStderr);
  });

  it('should close the readline interface if provided when there is an error', async () => {
    const mockError = new Error('Command failed');
    const mockReadline = { close: () => {} };
    exec.yields(mockError, null, null);

    await expect(execAsync('mock command', mockReadline)).to.be.rejectedWith(mockError);
    expect(mockReadline.close).to.have.been.calledOnce;
  });
});
