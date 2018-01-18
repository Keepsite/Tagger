const Path = require("path");
const electron = require("electron");
const uuid = require("uuid");

const utils = require("./utils.js");

const windows = {};
electron.ipcMain.on("tagger-command", (event, { windowId, name, id, args }) => {
  const window = windows[windowId];
  if (!window) throw new Error(`${windowId} window not found.`);

  Promise.resolve()
    .then(async () => {
      const command = window.commands[name];
      if (!command) throw new Error(`${name} is not a command.`);

      const data = { id };

      try {
        data.result = await command(...args);
      } catch (error) {
        const { stack, message } = error;
        // eslint-disable-next-line no-console
        console.error(stack);
        data.error = {
          message,
          stack
        };
      }

      window.browserWindow.webContents.send("tagger-result", data);
    })
    .catch(utils.handleCriticalError);
});

class Window {
  async init({ filename, commands = {} }) {
    this.id = uuid.v4();
    windows[this.id] = this;
    this.commands = commands;
    this.browserWindow = new electron.BrowserWindow();
    this.browserWindow.webContents.on("did-finish-load", () =>
      this.browserWindow.webContents.send("tagger-windowId", {
        windowId: this.id
      })
    );
    this.browserWindow.loadURL(
      Path.join("file://", __dirname, `../static/${filename}`)
    );
  }
}

module.exports = Window;
