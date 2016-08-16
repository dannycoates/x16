
const actions = require('./actions/experiment');
const { AddonManager } = require('resource://gre/modules/AddonManager.jsm');
const { Class } = require('sdk/core/heritage');

function getExperiment(getState, addon) {
  const { experiments } = getState()
  return experiments[addon.id]
}

const AddonListener = Class({
  initialize: function({dispatch, getState}) {
    this.getExperiment = getExperiment.bind(null, getState)
    this.dispatch = dispatch
    AddonManager.addAddonListener(this)
  },
  onEnabled: function(addon) {
    const x = this.getExperiment(addon)
    if (x) {
      this.dispatch(actions.experimentEnabled(x))
    }
  },
  onDisabled: function(addon) {
    if (this.getExperiment(addon)) {
      const x = this.getExperiment(addon)
      if (x) {
        this.dispatch(actions.experimentDisabled(x))
      }
    }
  },
  onUninstalling: function(addon) {
    const x = this.getExperiment(addon)
    if (x) {
      this.dispatch(actions.experimentUninstalling(x))
    }
  },
  onUninstalled: function(addon) {
    const x = this.getExperiment(addon)
    if (x) {
      this.dispatch(actions.experimentUninstalled(x))
    }
  },
  destroy: function () {
    AddonManager.removeAddonListener(this)
  }
})

module.exports = AddonListener
