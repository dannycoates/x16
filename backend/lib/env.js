/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const aboutConfig = require('sdk/preferences/service')
const environments = require('../../common/environments')
const { emit } = require('sdk/event/core')
const { EventTarget } = require('sdk/event/target')
const { PrefsTarget } = require('sdk/preferences/event-target')
const self = require('sdk/self')

const prefs = PrefsTarget()
const target = EventTarget()
target.get = function () {
  return environments[aboutConfig.get('testpilot.env', 'production')]
}

if (!aboutConfig.has('testpilot.env')) {
  aboutConfig.set('testpilot.env', target.get().name)
}

if (aboutConfig.get('testpilot.env') !== 'production') {
  aboutConfig.set(`extensions.${self.id}.sdk.console.logLevel`, 'debug')
  // TODO: set back on change? worth it?
}

prefs.on('testpilot.env', () => {
  emit(target, 'change', target.get())
})

module.exports = target
