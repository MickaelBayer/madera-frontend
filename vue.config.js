const webpack = require('webpack')

module.exports = {
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
          test: /\.html$/i,
          loader: 'html-loader',
        },
      ],
    },
  },

  devServer: {
    port: 8081,
    hot: true,
    disableHostCheck: true
  }
}
