import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import { configureStore, spy } from './lib/configureStore'
import AsyncApp from './lib/containers/AsyncApp'
import backend from './lib/backend'

const store = configureStore(backend)

render(
  <Provider store={store}>
    <AsyncApp />
  </Provider>,
  document.getElementById('root')
)
