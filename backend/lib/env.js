/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import aboutConfig from 'sdk/preferences/service'
import { CHANGE_ENV } from '../../common/actions'
import environments from '../../common/environments'
import { PrefsTarget } from 'sdk/preferences/event-target'
import self from 'sdk/self'

import type { Dispatch, ReduxStore } from 'testpilot/types'
export type Environment = {
  baseUrl: string,
  name: string,
  whitelist: string
}
export type Env = {
  get(): Environment,
  subscribe(store: ReduxStore): void
}

let dispatch: Dispatch = () => console.error('env.dispatch is not set')

const env = {
  get () {
    const name = aboutConfig.get('testpilot.env', 'production')
    const ev = typeof name === 'string' ? environments[name] : environments['production']
    return ev || environments['production']
  },
  subscribe (store: ReduxStore) {
    dispatch = store.dispatch
  }
}

if (!aboutConfig.has('testpilot.env')) {
  aboutConfig.set('testpilot.env', env.get().name)
}

if (aboutConfig.get('testpilot.env') !== 'production') {
  aboutConfig.set(`extensions.${self.id}.sdk.console.logLevel`, 'debug')
  // TODO: set back on change? worth it?
}

const prefs = new PrefsTarget()
prefs.on('testpilot.env', () => {
  dispatch(CHANGE_ENV())
})

export default env
