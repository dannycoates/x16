/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const AddonListener = require('./lib/actionCreators/AddonListener')
const configureStore = require('./lib/configureStore')
const createExperimentMetrics = require('./lib/metrics')
const env = require('./lib/env')
const FeedbackManager = require('./lib/actionCreators/FeedbackManager')
const Hub = require('./lib/middleware/Hub')
const InstallManager = require('./lib/actionCreators/InstallManager')
const Loader = require('./lib/actionCreators/Loader')
const MainUI = require('./lib/MainUI')
const NotificationManager = require('./lib/actionCreators/NotificationManager')
const self = require('sdk/self')
const { storage } = require('sdk/simple-storage')
const Telemetry = require('./lib/Telemetry')
const WebApp = require('./lib/WebApp')

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

const context = Object.assign({}, store, {
  env,
  feedbackManager,
  installManager,
  loader,
  notificationManager,
  telemetry,
  ui
})

const unsubscribe = store.subscribe(() => {
  const { sideEffects } = store.getState()
  if (typeof (sideEffects) === 'function') {
    sideEffects(context)
  }
})

let webapp = new WebApp({
  baseUrl: startEnv.baseUrl,
  whitelist: startEnv.whitelist,
  addonVersion: self.version,
  hub
})

exports.main = function (options) {
  installManager.selfLoaded(options.loadReason)
  hub.connect(ui.panel.port)
  notificationManager.schedule()
  feedbackManager.schedule()
}

exports.onUnload = function (reason) {
  installManager.selfUnloaded(reason)
  storage.root = store.getState()
  addons.teardown()
  experimentMetrics.teardown()
  telemetry.teardown()
  webapp.teardown()
  unsubscribe()
}

env.on('change', newEnv => {
  webapp.teardown()
  webapp = new WebApp({
    baseUrl: newEnv.baseUrl,
    whitelist: newEnv.whitelist,
    addonVersion: self.version,
    hub
  })
  loader.loadExperiments(newEnv.name, newEnv.baseUrl)
})

// Need to wait a tick for the ui port to "connect"
ui.once('connected', () => {
  const baseUrl = startEnv.name === 'any' ? store.getState().baseUrl : startEnv.baseUrl
  loader.loadExperiments(startEnv.name, baseUrl)
})
