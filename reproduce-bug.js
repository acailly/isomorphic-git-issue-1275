const git = require("isomorphic-git");
const makeDir = require("make-dir");
const rimraf = require("rimraf");
const path = require("path");
const fs = require("fs");
const execShellCommand = require("./execShellCommand");

async function reproduceBug() {
  // Repository info
  const repositoryUrl =
    "https://github.com/acailly/isomorphic-git-issue-1275.git";

  // Create local repository folder
  const localFolder = path.join(__dirname, "local-repo");
  if (fs.existsSync(localFolder)) {
    rimraf.sync(localFolder);
  }
  await makeDir(localFolder);

  // Clone using native git
  await execShellCommand(`git clone ${repositoryUrl} .`, localFolder);

  // Show file status using isomorphic-git
  const actualStatus = await git.status({
    fs,
    dir: localFolder,
    filepath: "README.md",
  });
  console.log("[isomorphic-git] Status of README.md file is");
  console.log(actualStatus);

  // Show file status using native Git
  const expectedStatus = await execShellCommand(
    `git status README.md --short`,
    localFolder
  );
  console.log("");
  console.log("[native-git] Status of README.md file is");
  console.log(expectedStatus);
}

reproduceBug();
