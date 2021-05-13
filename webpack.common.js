const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require("fs");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "production",
  // adds standard node modules
  externalsPresets: { node: true },
  // loads modules from node_modules instead of bundling them
  // externals: [nodeExternals()],
  target: "node",
  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
        exclude: [/node_modules/, /images/],
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        options: {
          // Disables attributes processing
          sources: false,
        },
      },
      {
        test: /\.css$/i,
        loader: "css-loader",
        options: {
          sourceMap: false,
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      chunks: [],
    }),

    new HtmlWebPackPlugin({
      template: "./src/404.html",
      filename: "./404.html",
      chunks: [],
    }),
  ],
  entry: {
    generateMap: "./src/generateMap",
    apiServer: "./src/apiServer",
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(fs.realpathSync("."), "dist"),
  },
};
