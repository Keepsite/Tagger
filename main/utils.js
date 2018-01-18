const fs = require("fs");
const childProcess = require("child_process");
const shellEnv = require("shell-env");
const electron = require("electron");

function promisify(func) {
  return (...args) =>
    new Promise((resolve, reject) =>
      func(...args, (error, result) => {
        if (error) return reject(error);
        resolve(result);
        return undefined;
      })
    );
}

function handleCriticalError(error) {
  // eslint-disable-next-line no-console
  console.error(error);
  electron.dialog.showMessageBox(
    null,
    {
      type: "error",
      title: "Fatel error",
      message: error.message
    },
    () => {
      process.exit(1);
    }
  );
}

const writeFile = promisify(fs.writeFile).bind(fs);
const readFile = promisify(fs.readFile).bind(fs);
const exec = promisify(childProcess.exec).bind(childProcess);
const execute = async (cwd, command) => {
  const env = shellEnv();

  const stdout = await exec(command, {
    cwd,
    env,
    windowHide: true
  });

  return stdout.trim();
};
module.exports = {
  writeFile,
  readFile,
  exec,
  execute,
  handleCriticalError
};
