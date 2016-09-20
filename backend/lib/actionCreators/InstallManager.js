/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('../actions')
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
  installExperiment: function (x) {
    AddonManager.getInstallForURL(
      x.xpi_url,
      install => {
        const { dispatch } = this.store
        install.addListener(new InstallListener({ install, dispatch }))
        install.install()
      },
      'application/x-xpinstall'
    )
  },
  uninstallAll: function () {
    const { getState } = this.store
    const active = activeExperiments(getState())
    for (let key of Object.keys(active)) {
      this.uninstallExperiment(active[key])
    }
  },
  uninstallSelf: function () {
    AddonManager.getAddonByID(self.id, a => a.uninstall())
  },
  selfLoaded: function (reason) {
    const { dispatch, getState } = this.store
    if (reason === 'install') {
      const { baseUrl } = getState()
      dispatch(actions.selfInstalled(baseUrl + '/onboarding'))
    } else if (reason === 'enable') {
      dispatch(actions.selfEnabled())
    }
  },
  selfUnloaded: function (reason) {
    const { dispatch } = this.store
    if (reason === 'disable') {
      dispatch(actions.selfDisabled())
    } else if (reason === 'uninstall') {
      dispatch(actions.selfUninstalled())
    }
  },
  syncInstalled: function () {
    const { dispatch, getState } = this.store
    dispatch(actions.syncInstalled({
      clientUUID: getState().clientUUID,
      installed: activeExperiments(getState())
    }))
  }
})

module.exports = InstallManager
