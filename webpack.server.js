const path = require("path");
const fs = require("fs");
// const nodeExternals = require("webpack-node-externals");

module.exports = {
  /**
   * This is a server build configuration
   */
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
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    esmodules: true,
                    node: "current",
                  },
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
  entry: {
    mapGeneratorWorker: "./src/mapGeneratorWorker",
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
