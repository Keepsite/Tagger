import React from "react";
import ReactDOM from "react-dom";
import uuid from "uuid";
import electron from "electron";

import Main from "./components/main.jsx";

const components = {
  Main
};

let windowId = null;
let windowOnload = null;
const commandCalls = [];
electron.ipcRenderer.on("tagger-result", (event, message) => {
  const commandCall = commandCalls.find(c => c.id === message.id);
  if (!commandCall) throw new Error(`${message.id} not registered.`);
  commandCall.resolve(message);
});

electron.ipcRenderer.on("tagger-windowId", (event, message) => {
  ({ windowId } = message);
  windowOnload();
});

window.addEventListener("load", () => {
  const next = () => {
    document.querySelectorAll("[data-component-name]").forEach(rootElement => {
      const componentName = rootElement.getAttribute("data-component-name");
      const Component = components[componentName];

      ReactDOM.render(
        <Component
          command={async (name, ...args) => {
            const id = uuid.v4();
            electron.ipcRenderer.send("tagger-command", {
              id,
              windowId,
              name,
              args
            });

            const { error, result } = await new Promise(resolve =>
              commandCalls.push({
                id,
                resolve
              })
            );

            if (error) throw new Error(`Error in ${name}: ${error.message}`);
            return result;
          }}
        />,
        rootElement
      );
    });
  };

  if (windowId) {
    next();
  } else {
    windowOnload = next;
  }
});
