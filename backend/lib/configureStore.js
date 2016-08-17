const redux = require('redux');
const thunkMiddleware = require('redux-thunk').default
const reducers = require('./reducers')

module.exports = function configureStore(hub, preloadedState) {
  return redux.createStore(
    reducers,
    preloadedState,
    redux.applyMiddleware(
      thunkMiddleware,
      hub.middleware()
    )
  )
}
