/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../../../common/actionTypes')
const { activeExperiments } = require('../reducers/experiments')
const { AddonManager } = require('resource://gre/modules/AddonManager.jsm')
const { Class } = require('sdk/core/heritage')
const self = require('sdk/self')
const _ = require('lodash/object')

const InstallListener = Class({
  initialize: function ({install, dispatch}) {
    this.dispatch = dispatch
    install.addListener(this)
  },
  onInstallEnded: function (install, addon) {
    this.dispatch(installEnded({
      addon_id: addon.id,
      installDate: addon.installDate
    }))
  },
  onInstallFailed: function (install) {
    this.dispatch(installFailed(install))
  },
  onInstallStarted: function (install) {
    this.dispatch(installStarted(install))
  },
  onInstallCancelled: function (install) {
    this.dispatch(installCancelled(install))
  },
  onDownloadStarted: function (install) {
    this.dispatch(downloadStarted(install))
  },
  onDownloadProgress: function (install) {
    this.dispatch(downloadProgress(install))
  },
  onDownloadEnded: function (install) {
    this.dispatch(downloadEnded(install))
  },
  onDownloadCancelled: function (install) {
    this.dispatch(downloadCancelled(install))
  },
  onDownloadFailed: function (install) {
    this.dispatch(downloadFailed(install))
  }
})

function installEnded (experiment) {
  return {
    type: actionTypes.INSTALL_ENDED,
    experiment
  }
}

function installFailed (install) {
  return {
    type: actionTypes.INSTALL_FAILED,
    install
  }
}

function installStarted (install) {
  return {
    type: actionTypes.INSTALL_STARTED,
    install
  }
}

function installCancelled (install) {
  return {
    type: actionTypes.INSTALL_CANCELLED,
    install
  }
}

function downloadStarted (install) {
  return {
    type: actionTypes.DOWNLOAD_STARTED,
    install
  }
}

function downloadProgress (install) {
  return {
    type: actionTypes.DOWNLOAD_PROGRESS,
    install
  }
}

function downloadEnded (install) {
  return {
    type: actionTypes.DOWNLOAD_ENDED,
    install
  }
}

function downloadCancelled (install) {
  return {
    type: actionTypes.DOWNLOAD_CANCELLED,
    install
  }
}

function downloadFailed (install) {
  return {
    type: actionTypes.DOWNLOAD_FAILED,
    install
  }
}

function experimentEnabled (experiment) {
  return {
    type: actionTypes.EXPERIMENT_ENABLED,
    experiment
  }
}

function experimentDisabled (experiment) {
  return {
    type: actionTypes.EXPERIMENT_DISABLED,
    experiment
  }
}

function experimentUninstalling (experiment) {
  return {
    type: actionTypes.EXPERIMENT_UNINSTALLING,
    experiment
  }
}

function experimentUninstalled (experiment) {
  return {
    type: actionTypes.EXPERIMENT_UNINSTALLED,
    experiment
  }
}

function installExperiment (experiment) {
  return (dispatch) => {
    AddonManager.getInstallForURL(
      experiment.xpi_url,
      install => {
        install.addListener(new InstallListener({ install, dispatch }))
        install.install()
      },
      'application/x-xpinstall'
    )
  }
}

function uninstallExperiment (experiment) {
  return () => {
    AddonManager.getAddonByID(experiment.addon_id, a => {
      if (a) { a.uninstall() }
    })
  }
}

function uninstallSelf () {
  return (dispatch, getState) => {
    const xs = _.values(activeExperiments(getState()))
    xs.forEach(x => uninstallExperiment(x)())
    AddonManager.getAddonByID(self.id, a => a.uninstall())
  }
}

module.exports = {
  experimentEnabled,
  experimentDisabled,
  experimentUninstalling,
  experimentUninstalled,
  installExperiment,
  uninstallExperiment,
  uninstallSelf
}