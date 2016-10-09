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
    path: __dirname,
    filename: 'backend.js',
    libraryTarget: 'commonjs'
  },
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: [['es2015', { modules: false }], 'stage-2']
        },
        exclude: /node_modules/,
        include: [__dirname, path.join(__dirname, '..', 'common')]
      }
    ]
  },
  externals: [
    /^sdk|chrome|resource/
  ],
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      },
      global: {}
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}

module.exports = config