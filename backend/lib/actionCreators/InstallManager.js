/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('../../../common/actions')
const { activeExperiments } = require('../reducers/experiments')
const { AddonManager } = require('resource://gre/modules/AddonManager.jsm')
const { Class } = require('sdk/core/heritage')
const InstallListener = require('./InstallListener')
const self = require('sdk/self')

const InstallManager = Class({
  initialize: function (store) {
    this.store = store
  },
  uninstallExperiment: function (x) {
    AddonManager.getAddonByID(x.addon_id, a => {
      if (a) { a.uninstall() }
    })
  },
  installExperiment: function (experiment) {
    AddonManager.getInstallForURL(
      experiment.xpi_url,
      install => {
        const { dispatch } = this.store
        install.addListener(new InstallListener({ install, experiment, dispatch }))
        install.install()
      },
      'application/x-xpinstall'
    )
  },
  uninstallAll: function () {
    const { getState } = this.store
    const active = activeExperiments(getState())
    for (let x of Object.values(active)) {
      this.uninstallExperiment(x)
    }
  },
  uninstallSelf: function () {
    AddonManager.getAddonByID(self.id, a => a.uninstall())
  },
  selfLoaded: function (reason) {
    const { dispatch, getState } = this.store
    if (reason === 'install') {
      const { baseUrl } = getState()
      dispatch(actions.SELF_INSTALLED({url: baseUrl + '/onboarding'}))
    } else if (reason === 'enable') {
      dispatch(actions.SELF_ENABLED())
    }
  },
  selfUnloaded: function (reason) {
    const { dispatch } = this.store
    if (reason === 'disable') {
      dispatch(actions.SELF_DISABLED())
    } else if (reason === 'uninstall') {
      dispatch(actions.SELF_UNINSTALLED())
    }
  },
  syncInstalled: function () {
    const { dispatch, getState } = this.store
    dispatch(actions.SYNC_INSTALLED({
      clientUUID: getState().clientUUID,
      installed: activeExperiments(getState())
    }))
  }
})

module.exports = InstallManager
