const redux = require('redux');
const thunkMiddleware = require('redux-thunk').default
const reducers = require('./reducers')

module.exports = function configureStore(preloadedState) {
  return redux.createStore(
    reducers.main,
    preloadedState,
    redux.applyMiddleware(thunkMiddleware)
  )
}
