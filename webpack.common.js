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
    ],
  },
  entry: {
    // api: "./src/api-server.js",
    main: "./src/main.js",
    // log: "./src/readCommings.js",
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  output: {
    filename: "[name].js",
  },
};
