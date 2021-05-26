const merger = require("webpack-merge");
const client = require("./webpack.client.js");
const server = require("./webpack.server.js");

module.exports = [
  merger.merge(client, {
    mode: "production",
    devtool: "source-map",
  }),
  merger.merge(server, {
    mode: "production",
    devtool: "source-map",
  }),
];

module.exports.parallelism = 1;
