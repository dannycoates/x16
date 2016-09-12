/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { combineReducers } = require('redux/dist/redux.min')

const reducers = combineReducers({
  experiments: require('./experiments').experiments,
  env: require('./env').env,
  baseUrl: require('./baseUrl').baseUrl,
  clientUUID: require('./clientUUID').clientUUID,
  ui: require('./ui').ui,
  notifications: require('./notifications').notifications,
  ratings: require('./ratings').ratings
})

module.exports = reducers
