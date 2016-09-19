/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('../actions')
const { Class } = require('sdk/core/heritage')

const InstallListener = Class({
  initialize: function ({install, dispatch}) {
    this.dispatch = dispatch
    install.addListener(this)
  },
  onInstallEnded: function (install, addon) {
    this.dispatch(actions.installEnded({
      addon_id: addon.id,
      installDate: addon.installDate
    }))
  },
  onInstallFailed: function (install) {
    this.dispatch(actions.installFailed(install))
  },
  onInstallStarted: function (install) {
    this.dispatch(actions.installStarted(install))
  },
  onInstallCancelled: function (install) {
    this.dispatch(actions.installCancelled(install))
  },
  onDownloadStarted: function (install) {
    this.dispatch(actions.downloadStarted(install))
  },
  onDownloadProgress: function (install) {
    this.dispatch(actions.downloadProgress(install))
  },
  onDownloadEnded: function (install) {
    this.dispatch(actions.downloadEnded(install))
  },
  onDownloadCancelled: function (install) {
    this.dispatch(actions.downloadCancelled(install))
  },
  onDownloadFailed: function (install) {
    this.dispatch(actions.downloadFailed(install))
  }
})

module.exports = InstallListener
