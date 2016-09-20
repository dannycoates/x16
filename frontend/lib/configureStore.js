/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers'

function commMiddleware (backend) {
  return (store) => {
    backend.store = store
    return (next) => (action) => {
      action.meta = action.meta || {}
      action.meta.src = action.meta.src || 'frontend'
      if (action.meta.src === 'frontend') {
        backend.send(action)
      }
      return next(action)
    }
  }
}

export function configureStore (backend, preloadedState) {
  return createStore(
    reducers,
    preloadedState,
    applyMiddleware(
      commMiddleware(backend)
    )
  )
}
