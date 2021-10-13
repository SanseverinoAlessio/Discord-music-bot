const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');
module.exports = {
  mode: 'production',
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
  plugins:[
    new Dotenv(),
  ],
};
