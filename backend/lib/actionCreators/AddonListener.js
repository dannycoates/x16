/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('../actions')
const { AddonManager } = require('resource://gre/modules/AddonManager.jsm')
const { Class } = require('sdk/core/heritage')

function getExperiment (getState, addon) {
  const { experiments } = getState()
  return experiments[addon.id]
}

const AddonListener = Class({
  initialize: function ({dispatch, getState}) {
    this.getExperiment = getExperiment.bind(null, getState)
    this.dispatch = dispatch
    AddonManager.addAddonListener(this)
  },
  onEnabled: function (addon) {
    const x = this.getExperiment(addon)
    if (x) {
      this.dispatch(actions.experimentEnabled(x))
    }
  },
  onDisabled: function (addon) {
    const x = this.getExperiment(addon)
    if (x) {
      this.dispatch(actions.experimentDisabled(x))
    }
  },
  onUninstalling: function (addon) {
    const x = this.getExperiment(addon)
    if (x) {
      this.dispatch(actions.experimentUninstalling(x))
    }
  },
  onUninstalled: function (addon) {
    const x = this.getExperiment(addon)
    if (x) {
      this.dispatch(actions.experimentUninstalled(x))
    }
  },
  onOperationCancelled: function (addon) {
    const x = this.getExperiment(addon)
    if (x) {
      if (addon.pendingOperations & AddonManager.PENDING_ENABLE) {
        this.dispatch(actions.experimentEnabled(x))
      }
    }
  },
  teardown: function () {
    AddonManager.removeAddonListener(this)
  }
})

module.exports = AddonListener
