import HtmlWebPackPlugin from "html-webpack-plugin";
import path from "path";
import fs from "fs";

export default {
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
    // apiServer: "./src/apiServer.js",
    // main: "./src/main.js",
    // readCommits: "./src/readCommits.js",
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(fs.realpathSync("."), "dist"),
  },
};
