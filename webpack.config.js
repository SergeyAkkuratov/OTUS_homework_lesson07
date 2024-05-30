const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      favicon: "./src/assets/favicon.png",
      filename: "./index.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      favicon: "./src/assets/favicon.png",
      filename: "404.html",
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
    compress: true,
    port: 9000,
    watchFiles: ["dist/index.html"],
    historyApiFallback: true,
  },
  optimization: {
    runtimeChunk: "single",
  },
};
