const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");

const isProduction =
  process.argv[process.argv.indexOf("--mode") + 1] === "production";
const PREFIX = isProduction ? "/OTUS_homework_lesson07" : "";

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: isProduction ? "/OTUS_homework_lesson07/" : "/", // Changed here
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      favicon: "./src/assets/favicon.png",
      filename: "index.html", // Changed here
    }),
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      favicon: "./src/assets/favicon.png",
      filename: "404.html",
    }),
    new DefinePlugin({
      PREFIX: JSON.stringify(PREFIX),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  devServer: {
    static: "./dist",
    historyApiFallback: true,
  },
  optimization: {
    runtimeChunk: "single",
  },
};
