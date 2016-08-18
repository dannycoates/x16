const redux = require('redux/dist/redux.min');
const thunkMiddleware = require('redux-thunk/dist/redux-thunk.min').default
const reducers = require('./reducers')
const { storage } = require('sdk/simple-storage')
const initialState = Object.assign({}, storage.root)

module.exports = function configureStore(hub) {
  return redux.createStore(
    reducers,
    initialState,
    redux.applyMiddleware(
      thunkMiddleware,
      hub.middleware()
    )
  )
}
