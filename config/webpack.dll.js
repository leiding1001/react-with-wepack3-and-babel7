const pathLib = require('path');
const CleanPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

const ROOT_PATH = pathLib.resolve(__dirname, '..');
const OUTPUT_PATH = pathLib.resolve(ROOT_PATH, 'dll-dist');

const isDev = process.env.NODE_ENV !== 'prod';

const dllConfig = {
  entry: {
    shim: [
      'console-polyfill',
      '@babel/polyfill',
      'raf/polyfill',
      'media-match'
    ],
    public: [
      'moment',
      'underscore'
      // 'moment/locale/zh-cn'
    ],
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-redux',
      'redux',
      'redux-saga',
      'react-intl'
    ]
  },
  output: {
    path: OUTPUT_PATH,
    filename: '[name].dll.js',
    library: '[name]_[chunkhash:5]'
    // library 与 DllPlugin 中的 name 一致
  },
  plugins: [
    new CleanPlugin(['dll-dist'], {
      root: ROOT_PATH
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(isDev ? 'development' : 'production')
      }
    }),
    new webpack.DllPlugin({
      context: __dirname,
      name: '[name]_[chunkhash:5]',
      path: pathLib.resolve(OUTPUT_PATH, '[name].manifest.json')
    })
  ],
  resolve: {
    alias: {},
    extensions: ['.js', '.jsx', '.json']
  },
  performance: {
    hints: false
  }
};

if (!isDev) {
  dllConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false
    })
  );
}

module.exports = dllConfig;
