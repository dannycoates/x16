/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import { AddonManager } from 'resource://gre/modules/AddonManager.jsm'
import Events from 'sdk/system/events'
import self from 'sdk/self'
import { Services } from 'resource://gre/modules/Services.jsm'
import { storage } from 'sdk/simple-storage'
import { TelemetryController } from 'resource://gre/modules/TelemetryController.jsm'

import type Variants from './variants'

const EVENT_SEND_METRIC = 'testpilot::send-metric'
const EVENT_RECEIVE_VARIANT_DEFS = 'testpilot::register-variants'
const EVENT_SEND_VARIANTS = 'testpilot::receive-variants'
const startTime = Services.startup.getStartupInfo().process

function makeTimestamp (timestamp = Date.now()) {
  return Math.round((timestamp - startTime) / 1000)
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

export default class Experiment {
  variants: Variants
  receiveVariantDefs: Function

  constructor (variants: Variants) {
    this.variants = variants
    this.receiveVariantDefs = receiveVariantDefs.bind(this)
    Events.on(EVENT_SEND_METRIC, experimentPing)
    Events.on(EVENT_RECEIVE_VARIANT_DEFS, this.receiveVariantDefs)
  }

  static ping (event) {
    experimentPing(event)
  }

  teardown () {
    Events.off(EVENT_SEND_METRIC, experimentPing)
    Events.off(EVENT_RECEIVE_VARIANT_DEFS, this.receiveVariantDefs)
  }
}
