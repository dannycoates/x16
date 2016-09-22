/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const redux = require('redux/dist/redux.min')
const createLogger = require('redux-logger/dist/index.min')
const reducers = require('./reducers')
const { storage } = require('sdk/simple-storage')
const initialState = Object.assign({}, storage.root)

module.exports = function configureStore ({hub, startEnv}) {
  if (!initialState.baseUrl) {
    initialState.baseUrl = startEnv.baseUrl
  }
  const middleware = [hub.middleware()]
  if (startEnv.name !== 'production') {
    middleware.push(createLogger({colors: false}))
  }
  return redux.createStore(
    reducers,
    initialState,
    redux.applyMiddleware(...middleware)
  )
}
