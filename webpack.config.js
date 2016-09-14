const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './src/app.js'
  ],
  output: {
    path: path.resolve(__dirname, "dist/assets"),
    filename: 'app.js',
    chunkFilename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'stage-3'],
        plugins: ["transform-object-assign", "transform-class-properties", "add-module-exports"]
      },
      exclude: /node_modules/,
      include: __dirname
    }, {
      test: /\.scss?$/,
      loader: ExtractTextPlugin.extract('style', 'css!sass'),
      include: __dirname
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style', 'css')
    }, {
      test: /\.html$/,
      loader: 'raw'
    }]
  },
  resolve: {
    alias: {
      'normalize.css': 'normalize.css/normalize.css'
    }
  },
  plugins: [
    new ExtractTextPlugin('app.css')
  ]
}
