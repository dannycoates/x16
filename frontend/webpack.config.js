/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const path = require('path')
const webpack = require('webpack')

const config = {
  entry: [path.join(__dirname, 'main.js')],
  output: {
    path: path.join(__dirname, '..', 'data'),
    publicPath: '/data/',
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
  plugins: []
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }))
} else {
  config.devtool = 'source-map'
  config.devServer = {
    contentBase: path.join(__dirname, '..'),
    publicPath: '/data/'
  }
}

module.exports = config
