// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const Timestamp = new Date().getTime();
module.exports = {
  // 打包时不生成.map文件 避免看到源码
  productionSourceMap: false,
  devServer: {
    port: 9999,
    proxy: {
      '/api/App': {
        target: 'http://txwebapi.szmyxxjs.com/api/App',
        changeOrigin: true,
      },
    }
  },
  lintOnSave: false,
  configureWebpack: {
    output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
      filename: `js/[name].${Timestamp}.js`,
      chunkFilename: `js/[name].${Timestamp}.js`
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 37.5,
            propList: ['*'],
            // 该项仅在使用 Circle 组件时需要
            // 原因参见 https://github.com/youzan/vant/issues/1948
            selectorBlackList: ['van-circle__layer']
          })
        ]
      }
    },
    extract: {
        filename: `css/[name].${Timestamp}.css`,
        chunkFilename: `css/[name].${Timestamp}.css`
    }
  }
};
