/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import Backend from './lib/Backend'
import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import { configureStore } from './lib/configureStore'
import App from './lib/containers/App'

const store = configureStore(new Backend())

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
