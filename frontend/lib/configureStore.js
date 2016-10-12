/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers'

// eslint-disable-next-line
import type { Middleware } from 'redux'
import type Backend from './Backend'

function commMiddleware (backend: Backend): Middleware {
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

export function configureStore (backend: Backend, preloadedState?: Object) {
  return createStore(
    reducers,
    preloadedState,
    applyMiddleware(
      commMiddleware(backend)
    )
  )
}
