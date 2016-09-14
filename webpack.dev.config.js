const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('./webpack.config.js');
config.devtool = 'cheap-module-eval-source-map';
config.entry.unshift('webpack-hot-middleware/client');
config.output.publicPath = '/';
config.devServer = {
  port: 8085,
  historyApiFallback: {
  	index: '/'
  }
}
config.plugins.push(new HtmlWebpackPlugin({
  filename: 'index.html',
  template: 'src/index.html',
  inject: true
}))

module.exports = config;
