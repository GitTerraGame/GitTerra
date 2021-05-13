const merger = require("webpack-merge");
const common = require("./webpack.common.js");

// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer");

module.exports = merger.merge(common, {
  mode: "production",
  devtool: "source-map",
  // plugins: [
  //   new BundleAnalyzerPlugin({
  //     analyzerMode: "static",
  //     reportFilename: "bundle-analysis-report.html",
  //   }),
  // ],
});
