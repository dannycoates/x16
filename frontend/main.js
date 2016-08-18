import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import { configureStore, spy } from './lib/configureStore'
import App from './lib/containers/App'
import backend from './lib/backend'

const store = configureStore(backend)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
