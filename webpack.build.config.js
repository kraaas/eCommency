const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('./webpack.config.js');

config.output.publicPath = '/assets/';
config.plugins.push(new HtmlWebpackPlugin({
  filename: '../index.html',
  template: 'src/index.html',
  inject: true
}))
module.exports = config;
