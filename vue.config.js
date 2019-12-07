//vue.config.js
module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
        symlinks:false
    },
  },
  chainWebpack: config => {
    config.module
    .rule('worker')
    .test(/\.worker\.js$/)
    .use('worker-loader')
    .loader('worker-loader')
    .end();
  }

}
