/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../../../common/actionTypes')
const { Class } = require('sdk/core/heritage')
const PrefsService = require('sdk/preferences/service')
const self = require('sdk/self')
const { Services } = require('resource://gre/modules/Services.jsm')
const { storage } = require('sdk/simple-storage')
const { TelemetryController } = require('resource://gre/modules/TelemetryController.jsm')
const WebExtensionChannels = require('../metrics/webextension-channels')

function makeTimestamp (time) {
  const timestamp = typeof time !== 'undefined' ? time : Date.now()
  return Math.round((timestamp - Services.startup.getStartupInfo().process) / 1000)
}

function pingTelemetry (object, event, time) {
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

const PREFS = [
  'toolkit.telemetry.enabled',
  'datareporting.healthreport.uploadEnabled'
]

const Metrics = Class({
  initialize: function () {
    storage.originalPrefs = {}
    for (let pref of PREFS) {
      storage.originalPrefs[pref] = PrefsService.get(pref)
      PrefsService.set(pref, true)
    }
  },
  destroy: function () {
    for (let pref of PREFS) {
      PrefsService.set(pref, storage.originalPrefs[pref])
    }
  },
  middleware: function () {
    return (store) => (next) => (action) => {
      switch (action.type) {
        case actionTypes.EXPERIMENT_ENABLED:
        case actionTypes.INSTALL_ENDED:
          WebExtensionChannels.add(action.experiment.addon_id)
          pingTelemetry(action.experiment.addon_id, 'enabled')
          break

        case actionTypes.EXPERIMENT_DISABLED:
        case actionTypes.EXPERIMENT_UNINSTALLING:
          WebExtensionChannels.remove(action.experiment.addon_id)
          pingTelemetry(action.experiment.addon_id, 'disabled')
          break

        case actionTypes.MAIN_BUTTON_CLICKED:
          pingTelemetry('txp_toolbar_menu_1', 'clicked')
          break

        case actionTypes.SELF_ENABLED:
          pingTelemetry(self.id, 'enabled')
          break

        case actionTypes.SELF_DISABLED:
          pingTelemetry(self.id, 'disabled')
          break
      }
      return next(action)
    }
  }
})

module.exports = Metrics
