const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    app: path.resolve(__dirname, "./src/js/index.js"),
  },
  snapshot: {
    managedPaths: [],
    unmanagedPaths: ["/dev_modules"],
  },
  watchOptions: {
    followSymlinks: true,
  },
  resolve: {
    symlinks: false,
    extensions: [".js", ".jsx"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    assetModuleFilename: "images/[name][ext]",
    clean: true,
  },
  target: "web",
  devServer: {
    static: path.resolve(__dirname, "./src"),
    port: 8080,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  devtool: "source-map",
  module: {
    rules: [
      { test: /\.xml$/, loader: 'xml-loader' },
      {
        test: /\.(js|jsx)$/,
        // exclude: /(node_modules|dev_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { modules: false }],
              [
                "@babel/preset-react",
                {
                  pragma: "vNode", // default pragma is React.createElement (only in classic runtime)
                  pragmaFrag: "Fragment", // default is React.Fragment (only in classic runtime)
                  throwIfNamespace: false, // defaults to true
                  runtime: "classic", // defaults to classic
                  targets: {
                    chrome: "120",
                  },
                  // "importSource": "custom-jsx-library" // defaults to react (only in automatic runtime)
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(svg|eot|ttf|woff|woff2)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "USEMOCK": JSON.stringify(process.env.USEMOCK || false),
    }),
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      chunks: ["app"],
      inject: "body",
      filename: "index.html",
    }),
  ],
};