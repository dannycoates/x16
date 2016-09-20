/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('../../../common/actions')
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
    const experiment = this.getExperiment(addon)
    if (experiment) {
      this.dispatch(actions.EXPERIMENT_ENABLED({experiment}))
    }
  },
  onDisabled: function (addon) {
    const experiment = this.getExperiment(addon)
    if (experiment) {
      this.dispatch(actions.EXPERIMENT_DISABLED({experiment}))
    }
  },
  onUninstalling: function (addon) {
    const experiment = this.getExperiment(addon)
    if (experiment) {
      this.dispatch(actions.EXPERIMENT_UNINSTALLING({experiment}))
    }
  },
  onUninstalled: function (addon) {
    const experiment = this.getExperiment(addon)
    if (experiment) {
      this.dispatch(actions.EXPERIMENT_UNINSTALLED({experiment}))
    }
  },
  onOperationCancelled: function (addon) {
    const experiment = this.getExperiment(addon)
    if (experiment) {
      if (addon.pendingOperations & AddonManager.PENDING_ENABLE) {
        this.dispatch(actions.EXPERIMENT_ENABLED({experiment}))
      }
    }
  },
  teardown: function () {
    AddonManager.removeAddonListener(this)
  }
})

module.exports = AddonListener
