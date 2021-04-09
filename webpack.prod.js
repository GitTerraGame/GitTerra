import merger from "webpack-merge";
import common from "./webpack.common.js";

// import BundleAnalyzerPlugin from "webpack-bundle-analyzer";

export default merger.merge(common, {
  mode: "production",
  devtool: "source-map",
  // plugins: [
  //   new BundleAnalyzerPlugin({
  //     analyzerMode: "static",
  //     reportFilename: "bundle-analysis-report.html",
  //   }),
  // ],
});
