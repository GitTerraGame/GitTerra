import merger from "webpack-merge";

import HtmlWebPackPlugin from "html-webpack-plugin";

import path from "path";
import fs from "fs";
import config from "config";

import common from "./webpack.common.js";

let webpackConfig = merger.merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  module: {
    rules: [
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
  ],
});

const devServer = {
  contentBase: [
    path.join(fs.realpathSync("."), "images"),
    path.join(fs.realpathSync("."), "repos"),
  ],
  contentBasePublicPath: ["/images/", "/maps/"],
};

if (typeof config.mapServerProxy !== "undefined" && config.mapServerProxy) {
  console.log(
    `[GitTerra] Will proxy requests from '/api/ to ${config.mapServerProxy}`
  );

  devServer.proxy = {
    "/api": {
      target: config.mapServerProxy,
      pathRewrite: { "^/api/": "/api/" },
      secure: false,
      changeOrigin: true,
    },
  };
}

webpackConfig = merger.merge(webpackConfig, {
  devServer,
});

export default webpackConfig;