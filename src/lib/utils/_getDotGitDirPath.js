const {execSync} = require('child_process');

const getDotGitDirPath = () => {
  const devNull = process.platform === 'win32' ? ' nul' : '/dev/null';
  const dir = execSync('git rev-parse --absolute-git-dir 2>' + devNull)
    .toString()
    .trim();

  return dir;
};

module.exports = getDotGitDirPath;
