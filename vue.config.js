const webpack = require('webpack')

module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jquery: 'jquery',
        'window.jQuery': 'jquery',
        jQuery: 'jquery'
      })
    ],
    module: {
      rules: [
        {
          test: /\.(html)$/,
          exclude: /(node_modules)/,
          use: {
            loader: "html-loader"
          }
        }
      ],
    },
  },

  devServer: {
    port: 8081,
    hot: true,
    disableHostCheck: true
  }
}
