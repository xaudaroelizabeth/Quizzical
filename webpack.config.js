const path = require("path");

module.exports = {
  entry: "./index.js", // main JS file
  output: {
    path: path.resolve(__dirname, "dist"), // bundle goes into /dist
    filename: "index.pack.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json"],
  },
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname),
    },
    port: 8080,
    open: true,
  },
};
