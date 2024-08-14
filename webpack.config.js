// const dotenv = require('dotenv');
const path = require("path");
const webpack = require("webpack");
const htmlWebpackPlugin = require("html-webpack-plugin");
const copyPlugin = require("copy-webpack-plugin");

// const env = dotenv.config().parsed;
// const envKeys = Object.keys(env).reduce((prev, next) => {
//     prev['process.env.' + next] = JSON.stringify(env[next]);
//     return prev;
// }, {});

module.exports = (env) => {
  return {
    mode: "development",
    entry: {
      app: path.resolve(__dirname, "src/js/index.js"),
    },
    snapshot: {
      managedPaths: [],
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
      static: path.resolve(__dirname, "src"),
      port: 80,
      open: false,
      hot: true,
      compress: true,
      historyApiFallback: true,
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: [
            /node_modules\/(?!@ocdla\/global-components)/,
            /dev_modules\/(?!@ocdla\/global-components)/,
          ],
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        },
        {
          test: /\.css$/i,
          exclude: [
            /node_modules\/(?!@ocdla\/global-components)/,
            /dev_modules\/(?!@ocdla\/global-components)/,
          ],
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(svg|eot|ttf|woff|woff2)$/i,
          exclude: [
            /node_modules\/(?!@ocdla\/global-components)/,
            /dev_modules\/(?!@ocdla\/global-components)/,
          ],
          type: "asset/resource",
        },
        {
          test: /\.(png|jpg|gif)$/i,
          exclude: [
            /node_modules\/(?!@ocdla\/global-components)/,
            /dev_modules\/(?!@ocdla\/global-components)/,
          ],
          type: "asset/resource",
        },
        {
          test: /\.xml$/i,
          exclude: [
            /node_modules\/(?!@ocdla\/global-components)/,
            /dev_modules\/(?!@ocdla\/global-components)/,
          ],
          type: "asset/source",
        },
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        USE_MOCK: JSON.stringify(env.USE_MOCK || false),
        APP_TYPE: JSON.stringify(env.APP_TYPE || false),

        // 'USEMOCK': JSON.parse(JSON.stringify(env.USEMOCK || false))
        // USEMOCK: JSON.stringify(env.USEMOCK || false)
        // USEMOCK: JSON.stringify(process.env.USEMOCK || false)
        // prettier-ignore
        // 'USEMOCK': JSON.stringify(process.env.USEMOCK || false)
        // APP_TYPE: JSON.stringify(process.env.APP_TYPE)
        // "process.env.USEMOCK": JSON.stringify(env.USEMOCK)
      }),
      // new dotenvWebpack({
      //     path: './.env'
      // }),
      // new webpack.DefinePlugin(envKeys),
      new htmlWebpackPlugin({
        template: path.resolve(__dirname, "src/index.html"),
        chunks: ["app"],
        inject: "body",
        filename: "index.html",
      }),
      new copyPlugin({
        patterns: [
          // {
          //     from: path.resolve(__dirname, 'src/images'),
          //     to: path.resolve(__dirname, 'dist/images')
          // }
          "src/.nojekyll",
        ],
      }),
    ],
  };
};
