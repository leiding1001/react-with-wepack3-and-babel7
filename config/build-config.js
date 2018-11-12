
module.exports = {
  environments: ['dev', 'prod', 'test'],
  // 当前webpack server 配置
  host: process.env.HOST || "localhost",
  port: process.env.PORT || (process.env.NODE_ENV === 'prod' ? 8080 : 8889),

  // API Server 配置
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT || '3030',

  // 在API Server 反向代理配置
  isRemoteProxy: false,
  // webpack proxy context， 包括API，以及不同project的重定向
  proxyPathPrefix: ['/ws'],
  remoteProxy: 'http://192.168.3.36',
  /**
   * 1. 通过Onboarding登录, 在登录时已经获取token，不需要在这设置token。
   * 2. 联调某个单独项目时，可以在这设置Token。
   */
  token: '',
  outputDir: 'build'
};
