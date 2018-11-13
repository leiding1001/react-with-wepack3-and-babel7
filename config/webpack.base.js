/*eslint-disable no-console*/
const pathLib = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('./build-config');

const ROOT_PATH = pathLib.resolve(__dirname, '..');
const SOURCE_PATH = pathLib.resolve(ROOT_PATH, 'src');
const ENTRY_PATH = pathLib.resolve(SOURCE_PATH, 'js');
const DLL_DIR_PATH = pathLib.resolve(ROOT_PATH, 'dll-dist');

const OUTPUT_PATH = pathLib.resolve(ROOT_PATH, config.outputDir);

const isDev = process.env.NODE_ENV !== 'prod';
const isSourceMap = isDev;
const isMinimize = !isDev;

console.log('----------------------BUILDING---------------------------------');
console.log('编译输出目录: ', OUTPUT_PATH);

module.exports = {
  entry: {
    index: pathLib.resolve(ENTRY_PATH, 'app.jsx')
  },
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: OUTPUT_PATH,
    filename: '[name]-[hash:8].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          formatter: require('eslint-formatter-friendly'),
          emitWarning: true
        }
      },
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        // exclude 是必不匹配选项（优先于 test 和 include）
        // - 尽量避免 exclude，更倾向于使用 include
        include: [
          SOURCE_PATH
        ],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: isMinimize,
                sourceMap: isSourceMap
              }
            },
            {
              loader: 'stylus-loader'
            }
          ],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(png|jpg|gif|JPG|GIF|PNG|BMP|bmp|JPEG|jpeg)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              /**
               * 在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL
               * DataURL: 图片数据以base64字符串格式嵌入到了页面中
               */
              limit: 10240
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)(\?(\w|#)*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanPlugin(['build', '*-build'], {
      root: ROOT_PATH
    }),
    new ProgressBarPlugin(),
    new webpack.DefinePlugin({
      __DEV__: isDev,
      'process.env.NODE_ENV': isDev
        ? JSON.stringify('development')
        : JSON.stringify('production')
    }),
    new CopyWebpackPlugin([
      {
        from: pathLib.resolve(ROOT_PATH, 'static/robots.txt')
      },
      {
        context: DLL_DIR_PATH,
        from: "*.dll.js",
        to: "static/js"
      },
      {
        context: pathLib.resolve(ROOT_PATH, 'static/js'),
        from: "*.js",
        to: "static/js"
      }
    ]),
    // 改善chunk传输
    new webpack.optimize.AggressiveMergingPlugin(),

    //保证出错时页面不阻塞，且会在编译结束后报错
    new webpack.NoEmitOnErrorsPlugin(),

    //用 HashedModuleIdsPlugin 可以轻松地实现 chunkhash 的稳定化
    new webpack.HashedModuleIdsPlugin(),

    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require(`${DLL_DIR_PATH}/shim.manifest.json`)
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require(`${DLL_DIR_PATH}/public.manifest.json`)
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require(`${DLL_DIR_PATH}/vendor.manifest.json`)
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',
      /**
       * 一个 chunk 的多个子 chunk 会有公共的模块,
       * 公共模块移入父 chunk (这个会减少总体的大小，但会对首次加载时间产生不良影响。
       * 如果预期用户需要下载许多兄弟 chunks，那这将非常有用)。
       */
      // children: true,
      /**
       * 用新的异步加载的额外公共chunk。当下载额外的 chunk 时，它将自动并行下载。
       */
      // async: true,
      /**
       * 在传入公共chunk(commons chunk) 之前所需要包含的最少数量的 chunks
       */
      minChunks: function(module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    /**
     * Since the vendor and manifest chunk use a different definition for minChunks, you need to invoke the plugin twice:
     * 用manifest实现js库的增量更新
     */

    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['runtime']
    }),
    new ExtractTextPlugin({
      filename: '[name]-[hash:6].css',
      // Disables the plugin
      disable: false,
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      title: 'Vanilla',
      inject: true,
      showErrors: true,
      template: pathLib.resolve(SOURCE_PATH, 'index.html')
    })
  ],
  // most of the time we don't want this bloat
  node: {
    net: 'mock',
    dns: 'mock'
  },
  resolve: {
    extensions: ['.js', '.json', '.sass', '.scss', '.less', 'jsx']
  }
};
