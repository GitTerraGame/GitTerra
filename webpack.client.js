const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require("fs");

module.exports = {
  /**
   * This is a client build configuration
   */
  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
        exclude: [/node_modules/, /images/],
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: "> 0.25%, not dead",
                },
              ],
              "@babel/preset-react",
            ],
          },
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
        use: ["style-loader", "css-loader"],
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
      chunks: ["index"],
    }),

    new HtmlWebPackPlugin({
      template: "./src/404.html",
      filename: "./404.html",
      chunks: [],
    }),
  ],
  entry: {
    index: "./src/index",
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
    alias: {
      images: path.resolve(fs.realpathSync("."), "images"),
    },
  },
  output: {
    filename: "[name].js",
    path: path.resolve(fs.realpathSync("."), "dist"),
  },
};
