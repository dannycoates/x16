/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('../../../common/actions')
const { Class } = require('sdk/core/heritage')

const InstallListener = Class({
  initialize: function ({install, dispatch}) {
    this.dispatch = dispatch
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
    this.dispatch(actions.INSTALL_FAILED({install}))
  },
  onInstallStarted: function (install) {
    this.dispatch(actions.INSTALL_STARTED({install}))
  },
  onInstallCancelled: function (install) {
    this.dispatch(actions.INSTALL_CANCELLED({install}))
  },
  onDownloadStarted: function (install) {
    this.dispatch(actions.DOWNLOAD_STARTED({install}))
  },
  onDownloadProgress: function (install) {
    this.dispatch(actions.DOWNLOAD_PROGRESS({install}))
  },
  onDownloadEnded: function (install) {
    this.dispatch(actions.DOWNLOAD_ENDED({install}))
  },
  onDownloadCancelled: function (install) {
    this.dispatch(actions.DOWNLOAD_CANCELLED({install}))
  },
  onDownloadFailed: function (install) {
    this.dispatch(actions.DOWNLOAD_FAILED({install}))
  }
})

module.exports = InstallListener
