import path from "path";
import { Configuration as Configuration } from "webpack";
const TerserPlugin = require("terser-webpack-plugin");

// File Copyright Header
const PACKAGE = require('../package.json');
const version = PACKAGE.version;
const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yyyy = today.getFullYear();
const date = mm + '/' + dd + '/' + yyyy;
const header = `/**
 * Author: EverCommerce
 * Author URI: https://www.evercommerce.com/
 * Version: ${version}
 * Updated: ${date}
 * 
 * Copyright EverCommerce
 * All Rights Reserved.
 * 
 * NOTICE: Unauthorized use or copying of this file
 *         via any medium is strictly prohibited.
 *         Proprietary and confidential
 */`;

const config: Configuration = {
  mode: "production",
  entry: "./src/ec.ts",
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: true,
          mangle: true,
          output: {
            preamble: header,
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
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
          },
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "../build"),
    filename: `ec-latest.min.js`
  },
};

export default config;