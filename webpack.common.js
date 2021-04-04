module.exports = {
  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  entry: {
    bootstrap4: "./src/widget-bootstrap4.js",
    plain: "./src/widget-plain.js",
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  output: {
    filename: "power-strip-[name].js",
  },
};
