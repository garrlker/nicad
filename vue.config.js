//vue.config.js
module.exports = {
  lintOnSave: false,

  configureWebpack: {
    resolve: {
      symlinks: false
    },
    devServer: {
      historyApiFallback: true
    }
  },
  chainWebpack: config => {
    config.module
      .rule("worker")
      .test(/\.worker\.js$/)
      .use("worker-loader")
      .loader("worker-loader")
      .end();

    const svgRule = config.module.rule("svg");

    svgRule.uses.clear();

    svgRule
      .use("babel-loader")
      .loader("babel-loader")
      .end()
      .use("vue-svg-loader")
      .loader("vue-svg-loader");
  },

  pluginOptions: {
    quasar: {
      importStrategy: "kebab",
      rtlSupport: false
    }
  },

  transpileDependencies: ["quasar"]
};
