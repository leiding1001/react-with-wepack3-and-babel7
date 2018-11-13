/*eslint-disable no-console*/
'use strict';
/**
 * 用 ES6 编写 Webpack 的配置文件
 */
const path = require('path');

const config = require('./config/build-config');

// Set the correct environment
let env = null;

if (process.env.NODE_ENV
  && config.environments.findIndex(it => it === process.env.NODE_ENV) != -1) {
  env = process.env.NODE_ENV;
} else {
  env = config.environments[0];
}

console.log('--------------------------WEBPACK-CONFIG-START---------------------------------');
console.log('当前环境: ', env);
console.log('webpack配置文件：', `./config/webpack.${env}.js`);


/**
 * Build the webpack configuration
 * @param  {String} wantedEnv The wanted environment
 * @return {Object} Webpack config
 */
function buildConfig(wantedEnv) {
  let config = require(path.join(
    __dirname,
    `./config/webpack.${wantedEnv}.js`
  ));

  return config;
}

module.exports = buildConfig(env);
