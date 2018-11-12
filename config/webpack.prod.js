/*eslint-disable no-console*/
const webpack = require('webpack');
const merge = require('webpack-merge');

const baseWebpackConfig = require('./webpack.base.js');

module.exports = merge(baseWebpackConfig, {
  /**
   * 不带列映射(column-map)的 SourceMap，将加载的 Source Map 简化为每行单独映射。
   */
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      // Use multi-process parallel running to improve the build speed
      parallel: true
    })
  ]
});
