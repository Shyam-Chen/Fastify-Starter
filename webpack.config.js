const path = require('path');
const webpack = require('webpack');
const NodemonPlugin = require('nodemon-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const envify = require('process-envify');

const env = require('./env');

const SOURCE_ROOT = path.join(__dirname, 'src');
const DISTRIBUTION_ROOT = path.join(__dirname, 'dist');

module.exports = ({ prod } = {}) => ({
  mode: prod ? 'production' : 'development',
  context: SOURCE_ROOT,
  entry: {
    app: './app.js',
  },
  output: {
    path: DISTRIBUTION_ROOT,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    alias: {
      '~': SOURCE_ROOT,
    },
  },
  plugins: [
    new webpack.DefinePlugin(envify(env)),
    !prod && new webpack.HotModuleReplacementPlugin(),
    !prod && new NodemonPlugin(),
    prod && new webpack.optimize.AggressiveSplittingPlugin(),
  ].filter(Boolean),
  devtool: prod ? 'hidden-source-map' : 'cheap-module-eval-source-map',
  target: 'node',
  externals: [
    nodeExternals(),
  ],
});
