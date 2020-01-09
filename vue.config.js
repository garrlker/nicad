//vue.config.js
module.exports = {
  lintOnSave: false,

  configureWebpack: {
    resolve: {
        symlinks:false
    },
    devServer: {
      historyApiFallback: true
    }
  },

  chainWebpack: config => {
    config.module
    .rule('worker')
    .test(/\.worker\.js$/)
    .use('worker-loader')
    .loader('worker-loader')
    .end();
  },

  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },

  transpileDependencies: [
    'quasar'
  ]
}
