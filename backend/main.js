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
const sideEffects = require('./lib/reducers/sideEffects')
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

sideEffects.setContext(Object.assign({}, store, {
  env,
  feedbackManager,
  installManager,
  loader,
  notificationManager,
  telemetry,
  ui
}))

sideEffects.enable(store)

let webapp = new WebApp({
  baseUrl: startEnv.baseUrl,
  whitelist: startEnv.whitelist,
  addonVersion: self.version,
  hub
})

exports.main = function ({loadReason}) {
  installManager.selfLoaded(loadReason)
  hub.connect(ui.panel.port)
  notificationManager.schedule()
  feedbackManager.schedule()
}

exports.onUnload = function (reason) {
  installManager.selfUnloaded(reason)
  storage.root = store.getState()
  sideEffects.disable()
  addons.teardown()
  experimentMetrics.teardown()
  webapp.teardown()
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
