/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

import aboutConfig from 'sdk/preferences/service'
import self from 'sdk/self'
import { Services } from 'resource://gre/modules/Services.jsm'
import { storage } from 'sdk/simple-storage'
import { TelemetryController } from 'resource://gre/modules/TelemetryController.jsm'

const startTime = Services.startup.getStartupInfo().process

function makeTimestamp (timestamp = Date.now()) {
  return Math.round((timestamp - startTime) / 1000)
}

const PREFS = [
  'toolkit.telemetry.enabled',
  'datareporting.healthreport.uploadEnabled'
]

export default class Telemetry {

  setPrefs () {
    storage.originalPrefs = PREFS.map(pref => [pref, aboutConfig.get(pref)])
    PREFS.forEach(pref => aboutConfig.set(pref, true))
  }

  restorePrefs () {
    if (storage.originalPrefs) {
      storage.originalPrefs.forEach(pair => { aboutConfig.set(pair[0], pair[1]) })
    }
  }

  ping (object, event, time) {
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
}
