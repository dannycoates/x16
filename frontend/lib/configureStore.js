import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducers from './reducers'
import { EventEmitter } from 'events'

function whatever(backend) {
  return (store) => {
    backend.store = store
    return (next) => (action) => {
      action.meta = action.meta || {}
      action.meta.src = action.meta.src || 'frontend'
      if (action.meta.src === 'frontend') {
        backend.send(action)
      }
      console.error(`frontend processing ${action.type}:${action.meta.src}`)
      return next(action)
    }
  }
}

export function configureStore(backend, preloadedState) {
  return createStore(
    reducers,
    preloadedState,
    applyMiddleware(
      thunkMiddleware,
      whatever(backend)
    )
  )
}
