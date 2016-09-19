/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../../../common/actionTypes')
const self = require('sdk/self')
const tabs = require('sdk/tabs')
const WebExtensionChannels = require('../metrics/webextension-channels')

module.exports = function sideEffects (state = null, { payload, type }) {
  switch (type) {
    case actionTypes.EXPERIMENT_ENABLED:
    case actionTypes.INSTALL_ENDED:
      return ({telemetry}) => {
        WebExtensionChannels.add(payload.experiment.addon_id)
        telemetry.ping(payload.experiment.addon_id, 'enabled')
      }

    case actionTypes.EXPERIMENT_DISABLED:
    case actionTypes.EXPERIMENT_UNINSTALLING:
      return ({telemetry}) => {
        WebExtensionChannels.remove(payload.experiment.addon_id)
        telemetry.ping(payload.experiment.addon_id, 'disabled')
      }

    case actionTypes.SHOW_EXPERIMENT:
      return ({ui}) => ui.openTab(payload.href)

    case actionTypes.EXPERIMENTS_LOADED:
      return ({loader}) => loader.schedule()

    case actionTypes.INSTALL_EXPERIMENT:
      return ({installManager}) => installManager.installExperiment(payload.experiment)

    case actionTypes.UNINSTALL_EXPERIMENT:
      return ({installManager}) => installManager.uninstallExperiment(payload.experiment)

    case actionTypes.UNINSTALL_SELF:
      return ({installManager}) => installManager.uninstallSelf()

    case actionTypes.SELF_UNINSTALLED:
      return ({installManager, telemetry}) => {
        telemetry.ping(self.id, 'disabled')
        installManager.uninstallAll()
      }

    case actionTypes.SET_BASE_URL:
      return ({loader, env}) => {
        const e = env.get()
        const url = e.name === 'any' ? payload.url : e.baseUrl
        loader.loadExperiments(e.name, url)
      }

    case actionTypes.GET_INSTALLED:
      return ({installManager}) => installManager.syncInstalled()

    case actionTypes.SHOW_RATING_PROMPT:
      return ({feedbackManager}) => feedbackManager.prompt(payload)

    case actionTypes.SET_BADGE:
      return ({ui}) => ui.setBadge()

    case actionTypes.MAIN_BUTTON_CLICKED:
      return ({ui, telemetry}) => {
        ui.setBadge()
        telemetry.ping('txp_toolbar_menu_1', 'clicked')
      }

    case actionTypes.MAYBE_NOTIFY:
      return ({notificationManager}) => notificationManager.maybeNotify(payload.experiment)

    case actionTypes.SCHEDULE_NOTIFIER:
      return ({notificationManager}) => notificationManager.schedule()

    case actionTypes.SELF_INSTALLED:
      return ({telemetry}) => {
        tabs.open({
          url: payload.url,
          inBackground: true
        })
        telemetry.ping(self.id, 'enabled')
      }

    case actionTypes.SELF_ENABLED:
      return ({telemetry}) => telemetry.ping(self.id, 'enabled')

    case actionTypes.SELF_DISABLED:
      return ({telemetry}) => telemetry.ping(self.id, 'disabled')

    default:
      return null
  }
}
