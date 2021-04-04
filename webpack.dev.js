const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const HtmlWebPackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const config = require("config");

let webpackConfig = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  entry: {
    reactsample: "./src/index.jsx",
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
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

if (typeof config.mapServerProxy !== "undefined" && config.mapServerProxy) {
  console.log(
    `[GitTerra] Will proxy requests from '/api/ to ${config.mapServerProxy}`
  );

  webpackConfig = merge(webpackConfig, {
    devServer: {
      proxy: {
        "/api": {
          target: config.mapServerProxy,
          pathRewrite: { "^/api/": "/" },
          secure: false,
          changeOrigin: true,
        },
      },
    },
  });
}

module.exports = webpackConfig;
