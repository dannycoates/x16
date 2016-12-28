/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import * as actions from '../../../common/actions'
import WebExtensionChannels from '../metrics/webextension-channels'

import typeof self from 'sdk/self'
import typeof tabs from 'sdk/tabs'
import type { Action, Dispatch, GetState, ReduxStore } from 'testpilot/types'
import type { Env } from '../env'
import type FeedbackManager from '../actionCreators/FeedbackManager'
import type InstallManager from '../actionCreators/InstallManager'
import type Loader from '../actionCreators/Loader'
import type NotificationManager from '../actionCreators/NotificationManager'
import type Telemetry from '../Telemetry'
import type MainUI from '../MainUI'
import type WebApp from '../WebApp'

export type Context = {
  dispatch: Dispatch,
  getState: GetState,
  env: Env,
  feedbackManager: FeedbackManager,
  installManager: InstallManager,
  loader: Loader,
  notificationManager: NotificationManager,
  self: self,
  tabs: tabs,
  telemetry: Telemetry,
  ui: MainUI,
  webapp: WebApp
}

export type SideEffect = (context: Context) => void

let context = {}
let unsubscribe = nothing

export function nothing () {}

export function reducer (state: Function = nothing, { payload, type }: Action): SideEffect {
  switch (type) {

    case actions.LOAD_EXPERIMENTS.type:
      return ({loader}) => { loader.loadExperiments(payload.envname, payload.baseUrl) }

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

    case actions.EXPERIMENTS_LOADED.type:
      return ({loader}) => loader.schedule()

    case actions.INSTALL_EXPERIMENT.type:
      return ({installManager}) => installManager.installExperiment(payload.experiment)

    case actions.UNINSTALL_EXPERIMENT.type:
      return ({installManager}) => installManager.uninstallExperiment(payload.experiment)

    case actions.UNINSTALL_SELF.type:
      return ({installManager}) => installManager.uninstallSelf()

    case actions.SELF_UNINSTALLED.type:
      return ({installManager, self, telemetry}) => {
        telemetry.ping(self.id, 'disabled')
        telemetry.restorePrefs()
        installManager.uninstallAll()
      }

    case actions.CHANGE_ENV.type:
      return ({env, dispatch, webapp}) => {
        const e = env.get()
        webapp.changeEnv(e)
        dispatch(actions.LOAD_EXPERIMENTS({ envname: e.name, baseUrl: e.baseUrl }))
      }

    case actions.SET_BASE_URL.type:
      return ({dispatch, env}) => {
        const e = env.get()
        const baseUrl = e.name === 'any' ? payload.url : e.baseUrl
        dispatch(actions.LOAD_EXPERIMENTS({ envname: e.name, baseUrl }))
      }

    case actions.GET_INSTALLED.type:
      return ({installManager}) => installManager.syncInstalled()

    case actions.SHOW_RATING_PROMPT.type:
      return ({feedbackManager}) => { feedbackManager.prompt(payload) }

    case actions.SET_BADGE.type:
      return ({ui}) => ui.setBadge()

    case actions.MAIN_BUTTON_CLICKED.type:
      return ({getState, ui, tabs, telemetry}) => {
        ui.setBadge()
        tabs.open({
          url: getState().baseUrl
        })
        telemetry.ping('txp_toolbar_menu_1', 'clicked')
      }

    case actions.MAYBE_NOTIFY.type:
      return ({notificationManager}) => notificationManager.maybeNotify(payload.experiment)

    case actions.SHOW_NOTIFICATION.type:
      return ({notificationManager}) => notificationManager.showNotification(payload)

    case actions.SCHEDULE_NOTIFIER.type:
      return ({notificationManager}) => notificationManager.schedule()

    case actions.SELF_INSTALLED.type:
      return ({self, tabs, telemetry}) => {
        tabs.open({
          url: payload.url,
          inBackground: true
        })
        telemetry.setPrefs()
        telemetry.ping(self.id, 'enabled')
      }

    case actions.SELF_ENABLED.type:
      return ({self, telemetry}) => {
        telemetry.setPrefs()
        telemetry.ping(self.id, 'enabled')
      }

    case actions.SELF_DISABLED.type:
      return ({self, telemetry}) => {
        telemetry.ping(self.id, 'disabled')
        telemetry.restorePrefs()
      }

    default:
      return nothing
  }
}

export function setContext (ctx: Context) {
  context = ctx
}

export function enable (store: ReduxStore) {
  unsubscribe = store.subscribe(() => store.getState().sideEffects(context))
}

export function disable () {
  unsubscribe()
  unsubscribe = nothing
}
