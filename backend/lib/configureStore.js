/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

import reducers from './reducers'
import { storage } from 'sdk/simple-storage'
import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'

const initialState = Object.assign({}, storage.root)

export default function configureStore ({hub, startEnv}) {
  if (!initialState.baseUrl) {
    initialState.baseUrl = startEnv.baseUrl
  }
  const middleware = [hub.middleware()]
  if (startEnv.name !== 'production') {
    middleware.push(createLogger({colors: false}))
  }
  return createStore(
    reducers,
    initialState,
    applyMiddleware(...middleware)
  )
}
