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
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [__dirname, path.join(__dirname, '..', 'common')],
        query: {
          presets: [['es2015', { modules: false }], 'react', 'stage-2']
        }
      },
      {
        test: /.(css|scss)$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.png$/,
        loader: 'url-loader'
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
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }))
} else {
  config.devtool = 'eval-source-map'
  config.devServer = {
    contentBase: path.join(__dirname, '..'),
    publicPath: '/data/'
  }
}

module.exports = config
