import backend from './lib/backend'
import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import { configureStore, spy } from './lib/configureStore'
import App from './lib/containers/App'

const store = configureStore(backend)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
