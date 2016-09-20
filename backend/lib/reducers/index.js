/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { combineReducers } = require('redux/dist/redux.min')

module.exports = combineReducers({
  baseUrl: require('./baseUrl'),
  clientUUID: require('./clientUUID'),
  env: require('./env'),
  experiments: require('./experiments').experiments,
  notifications: require('./notifications'),
  ratings: require('./ratings').ratings,
  sideEffects: require('./sideEffects'),
  ui: require('./ui')
})
