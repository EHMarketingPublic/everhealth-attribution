import path from "path";
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
const TerserPlugin = require("terser-webpack-plugin");

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
  mode: "development",
  entry: "./src/ec.ts",
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: true,
          mangle: true,
          output: {
            comments: false
          }
        }
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "../demo"),
    filename: "ec.min.js",
    sourceMapFilename: "[file].map"
  },
  devtool: "source-map",
  devServer: {
    static: path.join(__dirname, "../demo"),
    watchFiles: ('../src/**/*'),
    compress: true,
    port: 4000,
  },
};

export default config;