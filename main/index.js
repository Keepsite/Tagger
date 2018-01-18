const electron = require("electron");
const Application = require("./application.js");
const utils = require("./utils.js");

electron.app.on("ready", () =>
  Promise.resolve()
    .then(async () => {
      const application = new Application();
      await application.init();
    })
    .catch(utils.handleCriticalError)
);
