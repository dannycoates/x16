const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './main.js',
  output: {
    path: path.join(__dirname, '..', 'data'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /.(css|scss)$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.png$/,
        loader: 'url'
      }
    ]
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: JSON.stringify('production')
    //   }
    // })
  ]
}
