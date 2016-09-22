/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { Class } = require('sdk/core/heritage')
const PrefsService = require('sdk/preferences/service')
const self = require('sdk/self')
const { Services } = require('resource://gre/modules/Services.jsm')
const { storage } = require('sdk/simple-storage')
const { TelemetryController } = require('resource://gre/modules/TelemetryController.jsm')
const startTime = Services.startup.getStartupInfo().process

function makeTimestamp (timestamp = Date.now()) {
  return Math.round((timestamp - startTime) / 1000)
}

const PREFS = [
  'toolkit.telemetry.enabled',
  'datareporting.healthreport.uploadEnabled'
]

const Telemetry = Class({
  setPrefs: function () {
    storage.originalPrefs = PREFS.map(pref => [pref, PrefsService.get(pref)])
    PREFS.forEach(pref => PrefsService.set(pref, true))
  },
  restorePrefs: function () {
    if (storage.originalPrefs) {
      storage.originalPrefs.forEach(pair => { PrefsService.set(pair[0], pair[1]) })
    }
  },
  ping: function (object, event, time) {
    console.debug(`tel: ${object} event: ${event}`)
    const payload = {
      timestamp: makeTimestamp(),
      test: self.id,
      version: self.version,
      events: [
        {
          timestamp: makeTimestamp(time),
          event,
          object
        }
      ]
    }
    TelemetryController.submitExternalPing(
      'testpilot',
      payload,
      {
        addClientId: true,
        addEnvironment: true
      }
    )
  }
})

module.exports = Telemetry
