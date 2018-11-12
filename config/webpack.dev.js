/*eslint-disable no-console*/
const webpack = require('webpack');
const merge = require('webpack-merge');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const baseWebpackConfig = require('./webpack.base.js');
const config = require('./build-config');

// API Server 服务地址
const proxyTarget = `http://${config.apiHost}:${config.apiPort}`;

module.exports = merge(baseWebpackConfig, {
  devServer: {
    host: '0.0.0.0',
    port: config.port,
    disableHostCheck: true,
    historyApiFallback: true,
    proxy: [
      {
        // 拦截多个类型API接口
        context: config.proxyPathPrefix,
        target: proxyTarget
      }
    ]
  },
  /**
   * devTool
   * http://www.css88.com/doc/webpack/configuration/devtool/
   * https://github.com/webpack/webpack/tree/master/examples/source-map
   */
  /**
   * 每个模块使用 eval() 执行，并且 SourceMap 转换为 DataUrl 后添加到 eval() 中。
   * 初始化 SourceMap 时比较慢，但是会在重构建时提供很快的速度，并且生成实际的文件。
   * 行数能够正确映射，因为会映射到原始代码中。
   */
  // devtool: 'eval-source-map',
  /**
   * 末尾的注释 sourceMap 作为 DataURL 的形式被内嵌进了 bundle中
   */
  // devtool: 'inline-source-map',

  devtool: 'eval-source-map',

  plugins: [
    // new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new OpenBrowserPlugin({
      url: `http://${config.host}:${config.port}`
    })
  ]
});
