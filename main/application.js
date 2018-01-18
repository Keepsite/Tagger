const path = require("path");
const shellEnv = require("shell-env");
const assert = require("assert");
const electron = require("electron");

const utils = require("./utils.js");
const Window = require("./window.js");

class Application {
  async init() {
    {
      const env = await shellEnv();
      const homePath = env.HOME;
      this.configPath = path.join(homePath, ".tagger-config.json");

      try {
        const configJSON = await utils.readFile(this.configPath, "utf8");
        const config = JSON.parse(configJSON);

        if (!config.repos) config.repos = [];
        assert.equal(config.repos.constructor, Array);

        this.config = config;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error.stack);
        this.config = {
          repos: []
        };
        await this.saveConfig();
      }

      this.main = new Window();
      await this.main.init({
        filename: "main.html",
        commands: {
          load: async () => {
            const repos = [];

            for (const { repoPath } of this.config.repos) {
              throw new Error(`TODO: load ${repoPath}`);
            }

            return {
              repos
            };
          },

          newRepo: async () => {
            const newRepo = new Window();
            newRepo.init({
              filename: "new_repo.html",
              commands: {
                submit: async repo => {
                  assert.ok(repo.repoPath, "Repository path is required.");
                  this.config.repos.push(repo);
                  await this.saveConfig();
                  newRepo.browserWindow.close();
                },
                cancel: () => {
                  newRepo.browserWindow.close();
                }
              }
            });
          }
        }
      });

      electron.app.on("window-all-closed", () => process.exit(0));
    }
  }

  async saveConfig() {
    await utils.writeFile(
      this.configPath,
      JSON.stringify(this.config, null, "  "),
      "utf8"
    );
  }
}

module.exports = Application;
