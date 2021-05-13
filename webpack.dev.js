const merger = require("webpack-merge");

const path = require("path");
const fs = require("fs");
const config = require("config");

const common = require("./webpack.common.js");

let webpackConfig = merger.merge(common, {
  mode: "development",
  devtool: "eval-source-map",
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

module.exports = webpackConfig;
