'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    reqUrl:{//测试环境访问接口地址
      appOrder:"/appOrder/",
      extension: "/ecsc-extension-rpc/",
      payment:"/payment/news/post",
    },
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {//反向代理实现跨域
      "/appOrder": {
        target: "http://test.e7e6.net/scmapp/appOrder/",
        changeOrigin: true,  //是否跨域
        pathRewrite: {"^/appOrder" : ""} //后面可以使重写的新路径，一般不做更改
      },
      "/extension": {
        target: "http://ecsc.meishijia.com/ecsc-extension-rpc/",
        pathRewrite: {"^/extension" : ""} //后面可以使重写的新路径，一般不做更改
      },
      "/payment": {
        target: "http://test.e7e6.net/payment/news/post",
        pathRewrite: {"^/payment" : ""} //后面可以使重写的新路径，一般不做更改
      }
    },

    // Various Dev Server settings
    host: '10.0.130.222', // can be overwritten by process.env.HOST
    port: process.env.PORT||8082, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,//项目启动自动打开浏览器
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    reqUrl:{//线上环境
      appOrder: "http://www.e7e6.net/scmapp/appOrder/",
      extension: "http://ecsc.e7e6.net/ecsc-extension-rpc/",
      payment: "http://www.e7e6.net/payment/news/post",
    },
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
