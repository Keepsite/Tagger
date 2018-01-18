module.exports = {
  extends: ["airbnb", "prettier"],
  env: {
    browser: true
  },
  rules: {
    "import/extensions": 0,
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "arrow-body-style": 0,
    "no-restricted-syntax": 0
  }
};
