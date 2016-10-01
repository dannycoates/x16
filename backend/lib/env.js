/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const aboutConfig = require('sdk/preferences/service')
const { CHANGE_ENV } = require('../../../common/actions')
const environments = require('../../common/environments')
const { PrefsTarget } = require('sdk/preferences/event-target')
const self = require('sdk/self')

let store = {
  dispatch: () => console.error('env.store is not set')
}

const env = {
  get: function () {
    return environments[aboutConfig.get('testpilot.env', 'production')]
  },
  subscribe: function (it) {
    store = it
  }
}

if (!aboutConfig.has('testpilot.env')) {
  aboutConfig.set('testpilot.env', env.get().name)
}

if (aboutConfig.get('testpilot.env') !== 'production') {
  aboutConfig.set(`extensions.${self.id}.sdk.console.logLevel`, 'debug')
  // TODO: set back on change? worth it?
}

const prefs = PrefsTarget()
prefs.on('testpilot.env', () => {
  store.dispatch(CHANGE_ENV())
})

module.exports = env
