const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

const environment = process.env.NODE_ENV;

let config = {
  mode: environment,
  target: "node",
  entry: ["./server/ssr.js"],
  output: {
    path: path.resolve(__dirname, "server/"),
    publicPath: "/server/",
    filename: "ssrCompiled.js",
    libraryTarget: "commonjs"
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },

  externals: [nodeExternals()],
  watch: process.env.NODE_ENV !== "production"
};

module.exports = config;
