import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import configureStore from './lib/configureStore'
import AsyncApp from './lib/containers/AsyncApp'
import backend from './lib/backend'

const store = configureStore({ env: 'production' })

backend.store = store

render(
  <Provider store={store}>
    <AsyncApp />
  </Provider>,
  document.getElementById('root')
)
