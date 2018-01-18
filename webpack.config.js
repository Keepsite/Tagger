const path = require("path");

module.exports = {
  entry: {
    renderer: [
      "babel-polyfill",
      "./renderer/index.jsx",
      "./renderer/styles.scss"
    ]
  },
  output: {
    path: path.resolve(__dirname, "static"),
    filename: "renderer.js"
  },
  target: "electron-renderer",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader"
      }
    ]
  }
};
