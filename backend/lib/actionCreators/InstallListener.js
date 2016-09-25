/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('../../../common/actions')
const { Class } = require('sdk/core/heritage')

function toObject (install, experiment) {
  // install properties aren't enumerable
  return {
    addon_id: experiment.addon_id,
    type: install.type,
    state: install.state,
    error: install.error,
    progress: install.progress,
    maxProgress: install.maxProgress
  }
}

const InstallListener = Class({
  initialize: function ({install, experiment, dispatch}) {
    this.dispatch = dispatch
    this.experiment = experiment
    install.addListener(this)
  },
  onInstallEnded: function (install, addon) {
    this.dispatch(actions.INSTALL_ENDED({
      experiment: {
        addon_id: addon.id,
        installDate: addon.installDate
      }
    }))
  },
  onInstallFailed: function (install) {
    install = toObject(install, this.experiment)
    this.dispatch(actions.INSTALL_FAILED({install}))
  },
  onInstallStarted: function (install) {
    install = toObject(install, this.experiment)
    this.dispatch(actions.INSTALL_STARTED({install}))
  },
  onInstallCancelled: function (install) {
    install = toObject(install, this.experiment)
    this.dispatch(actions.INSTALL_CANCELLED({install}))
  },
  onDownloadStarted: function (install) {
    install = toObject(install, this.experiment)
    this.dispatch(actions.DOWNLOAD_STARTED({install}))
  },
  onDownloadProgress: function (install) {
    install = toObject(install, this.experiment)
    this.dispatch(actions.DOWNLOAD_PROGRESS({install}))
  },
  onDownloadEnded: function (install) {
    install = toObject(install, this.experiment)
    this.dispatch(actions.DOWNLOAD_ENDED({install}))
  },
  onDownloadCancelled: function (install) {
    install = toObject(install, this.experiment)
    this.dispatch(actions.DOWNLOAD_CANCELLED({install}))
  },
  onDownloadFailed: function (install) {
    install = toObject(install, this.experiment)
    this.dispatch(actions.DOWNLOAD_FAILED({install}))
  }
})

module.exports = InstallListener
