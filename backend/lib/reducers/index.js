/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { combineReducers } = require('redux/dist/redux.min')

module.exports = combineReducers({
  baseUrl: require('./baseUrl').reducer,
  clientUUID: require('./clientUUID').reducer,
  env: require('./env').reducer,
  experiments: require('./experiments').reducer,
  notifications: require('./notifications').reducer,
  ratings: require('./ratings').reducer,
  sideEffects: require('./sideEffects').reducer,
  ui: require('./ui').reducer
})
