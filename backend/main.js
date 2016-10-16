/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import AddonListener from './lib/actionCreators/AddonListener'
import configureStore from './lib/configureStore'
import createExperimentMetrics from './lib/metrics'
import env from './lib/env'
import FeedbackManager from './lib/actionCreators/FeedbackManager'
import Hub from './lib/middleware/Hub'
import InstallManager from './lib/actionCreators/InstallManager'
import Loader from './lib/actionCreators/Loader'
import MainUI from './lib/MainUI'
import NotificationManager from './lib/actionCreators/NotificationManager'
import self from 'sdk/self'
import * as sideEffects from './lib/reducers/sideEffects'
import { storage } from 'sdk/simple-storage'
import Telemetry from './lib/Telemetry'
import WebApp from './lib/WebApp'

const startEnv = env.get()
const hub = new Hub()
const store = configureStore({ startEnv, hub })
const addons = new AddonListener(store)
const experimentMetrics = createExperimentMetrics(store.getState().clientUUID)
const feedbackManager = new FeedbackManager(store)
const installManager = new InstallManager(store)
const loader = new Loader(store)
const notificationManager = new NotificationManager(store)
const telemetry = new Telemetry()
const ui = new MainUI(store)
const webapp = new WebApp({
  baseUrl: startEnv.baseUrl,
  whitelist: startEnv.whitelist,
  addonVersion: self.version,
  hub
})

sideEffects.setContext(Object.assign({}, store, {
  env,
  feedbackManager,
  installManager,
  loader,
  notificationManager,
  telemetry,
  ui,
  webapp
}))

export function main ({loadReason}: {loadReason: string}) {
  env.subscribe(store)
  sideEffects.enable(store)
  installManager.selfLoaded(loadReason)
  hub.connect(ui.panel.port)
  notificationManager.schedule()
  feedbackManager.schedule()
}

export function onUnload (reason: string) {
  installManager.selfUnloaded(reason)
  storage.root = store.getState()
  sideEffects.disable()
  addons.teardown()
  experimentMetrics.teardown()
  webapp.teardown()
}
