/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('../../../common/actions')
const self = require('sdk/self')
const tabs = require('sdk/tabs')
const WebExtensionChannels = require('../metrics/webextension-channels')

function nothing () {}

let context = {}
let unsubscribe = nothing

function reducer (state = nothing, { payload, type }) {
  switch (type) {
    case actions.LOAD_EXPERIMENTS.type:
      return ({loader}) => {
        loader.loadExperiments(payload.env, payload.baseUrl)
      }
    case actions.EXPERIMENT_ENABLED.type:
    case actions.INSTALL_ENDED.type:
      return ({telemetry}) => {
        WebExtensionChannels.add(payload.experiment.addon_id)
        telemetry.ping(payload.experiment.addon_id, 'enabled')
      }

    case actions.EXPERIMENT_DISABLED.type:
    case actions.EXPERIMENT_UNINSTALLING.type:
      return ({telemetry}) => {
        WebExtensionChannels.remove(payload.experiment.addon_id)
        telemetry.ping(payload.experiment.addon_id, 'disabled')
      }

    case actions.SHOW_EXPERIMENT.type:
      return ({ui}) => ui.openTab(payload.url)

    case actions.EXPERIMENTS_LOADED.type:
      return ({loader}) => loader.schedule()

    case actions.INSTALL_EXPERIMENT.type:
      return ({installManager}) => installManager.installExperiment(payload.experiment)

    case actions.UNINSTALL_EXPERIMENT.type:
      return ({installManager}) => installManager.uninstallExperiment(payload.experiment)

    case actions.UNINSTALL_SELF.type:
      return ({installManager}) => installManager.uninstallSelf()

    case actions.SELF_UNINSTALLED.type:
      return ({installManager, telemetry}) => {
        telemetry.ping(self.id, 'disabled')
        telemetry.restorePrefs()
        installManager.uninstallAll()
      }

    case actions.SET_BASE_URL.type:
      return ({dispatch, env}) => {
        const e = env.get()
        const baseUrl = e.name === 'any' ? payload.url : e.baseUrl
        dispatch(actions.LOAD_EXPERIMENTS({ env: e.name, baseUrl }))
      }

    case actions.GET_INSTALLED.type:
      return ({installManager}) => installManager.syncInstalled()

    case actions.SHOW_RATING_PROMPT.type:
      return ({feedbackManager}) => feedbackManager.prompt(payload)

    case actions.SET_BADGE.type:
      return ({ui}) => ui.setBadge()

    case actions.MAIN_BUTTON_CLICKED.type:
      return ({ui, telemetry}) => {
        ui.setBadge()
        ui.showPanel()
        telemetry.ping('txp_toolbar_menu_1', 'clicked')
      }

    case actions.MAYBE_NOTIFY.type:
      return ({notificationManager}) => notificationManager.maybeNotify(payload.experiment)

    case actions.SCHEDULE_NOTIFIER.type:
      return ({notificationManager}) => notificationManager.schedule()

    case actions.SELF_INSTALLED.type:
      return ({telemetry}) => {
        tabs.open({
          url: payload.url,
          inBackground: true
        })
        telemetry.setPrefs()
        telemetry.ping(self.id, 'enabled')
      }

    case actions.SELF_ENABLED.type:
      return ({telemetry}) => {
        telemetry.setPrefs()
        telemetry.ping(self.id, 'enabled')
      }

    case actions.SELF_DISABLED.type:
      return ({telemetry}) => {
        telemetry.ping(self.id, 'disabled')
        telemetry.restorePrefs()
      }

    default:
      return nothing
  }
}

function setContext (ctx) {
  context = ctx
}

function enable (store) {
  unsubscribe = store.subscribe(() => store.getState().sideEffects(context))
}

function disable () {
  unsubscribe()
  unsubscribe = nothing
}

module.exports = {
  reducer,
  setContext,
  enable,
  disable,
  nothing
}
