/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { AddonManager } = require('resource://gre/modules/AddonManager.jsm')
const { Class } = require('sdk/core/heritage')
const Events = require('sdk/system/events')
const self = require('sdk/self')
const { Services } = require('resource://gre/modules/Services.jsm')
const { storage } = require('sdk/simple-storage')
const { TelemetryController } = require('resource://gre/modules/TelemetryController.jsm')

const EVENT_SEND_METRIC = 'testpilot::send-metric'
const EVENT_RECEIVE_VARIANT_DEFS = 'testpilot::register-variants'
const EVENT_SEND_VARIANTS = 'testpilot::receive-variants'

function makeTimestamp (time) {
  const timestamp = typeof time !== 'undefined' ? time : Date.now()
  return Math.round((timestamp - Services.startup.getStartupInfo().process) / 1000)
}

function experimentPing (event) {
  const timestamp = Date.now()
  const { subject, data } = event

  AddonManager.getAddonByID(subject, addon => {
    const payload = {
      test: subject,
      version: addon.version,
      timestamp: makeTimestamp(timestamp),
      variants: (
        (storage.experimentVariants && subject in storage.experimentVariants)
        ? storage.experimentVariants[subject] : null
      ),
      payload: JSON.parse(data)
    }
    TelemetryController.submitExternalPing(
      'testpilottest', payload,
      { addClientId: true, addEnvironment: true }
    )
  })
}

function receiveVariantDefs (event) {
  if (!storage.experimentVariants) {
    storage.experimentVariants = {}
  }

  const { subject, data } = event
  const dataParsed = this.variants.parseTests(JSON.parse(data))

  storage.experimentVariants[subject] = dataParsed
  Events.emit(EVENT_SEND_VARIANTS, {
    data: JSON.stringify(dataParsed),
    subject: self.id
  })
}

const Experiment = Class({
  initialize: function (variants) {
    this.variants = variants
    this.receiveVariantDefs = receiveVariantDefs.bind(this)
    Events.on(EVENT_SEND_METRIC, experimentPing)
    Events.on(EVENT_RECEIVE_VARIANT_DEFS, this.receiveVariantDefs)
  },
  destroy: function () {
    Events.off(EVENT_SEND_METRIC, experimentPing)
    Events.off(EVENT_RECEIVE_VARIANT_DEFS, this.receiveVariantDefs)
  }
})
Experiment.ping = experimentPing

module.exports = Experiment
