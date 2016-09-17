/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('./lib/actions')
const {
  SHOW_EXPERIMENT,
  INSTALL_EXPERIMENT,
  UNINSTALL_EXPERIMENT,
  UNINSTALL_SELF,
  GET_INSTALLED,
  SET_BASE_URL,
  SET_BADGE,
  MAIN_BUTTON_CLICKED,
  MAYBE_NOTIFY
} = require('../common/actionTypes')
const { activeExperiments } = require('./lib/reducers/experiments')
const AddonListener = require('./lib/AddonListener')
const configureStore = require('./lib/configureStore')
const createExperimentMetrics = require('./lib/metrics')
const env = require('./lib/env')
const Hub = require('./lib/middleware/hub')
const Metrics = require('./lib/middleware/metrics')
const notificationManager = require('./lib/notificationManager')
const self = require('sdk/self')
const { storage } = require('sdk/simple-storage')
const FeedbackManager = require('./lib/FeedbackManager')
const tabs = require('sdk/tabs')
const MainUI = require('./lib/MainUI')
const { WebApp } = require('./lib/webapp')

const hub = new Hub()
const metrics = new Metrics()
const store = configureStore({ hub, metrics })
const experimentMetrics = createExperimentMetrics(store.getState().clientUUID)
const addons = new AddonListener(store)
const ui = new MainUI(store)
const feedbackManager = new FeedbackManager({ store })
const startEnv = env.get()

let webapp = new WebApp({
  baseUrl: startEnv.baseUrl,
  whitelist: startEnv.whitelist,
  addonVersion: self.version,
  hub
})

hub.connect(ui.panel.port)
hub.on(SHOW_EXPERIMENT, a => ui.openTab(a.payload.href))
  .on(INSTALL_EXPERIMENT, a => store.dispatch(actions.installExperiment(a.payload.experiment)))
  .on(UNINSTALL_EXPERIMENT, a => store.dispatch(actions.uninstallExperiment(a.payload.experiment)))
  .on(UNINSTALL_SELF, a => store.dispatch(actions.uninstallSelf()))
  .on(SET_BASE_URL, a => {
    // refresh experiments
    const e = env.get()
    const url = e.name === 'any' ? a.payload.url : e.baseUrl
    store.dispatch(actions.loadExperiments(e.name, url))
  })
  .on(GET_INSTALLED, a => {
    store.dispatch(actions.syncInstalled({
      clientUUID: store.getState().clientUUID,
      installed: activeExperiments(store.getState())
    }))
    // store.dispatch(actions.showRating(0, store.getState().experiments['universal-search@mozilla.com']))
  })
  .on(SET_BADGE, a => ui.setBadge())
  .on(MAIN_BUTTON_CLICKED, a => ui.setBadge())
  .on(MAYBE_NOTIFY, a => notificationManager.schedule(store))

exports.main = function (options) {
  env.on('change', newEnv => {
    webapp.destroy()
    webapp = new WebApp({
      baseUrl: newEnv.baseUrl,
      whitelist: newEnv.whitelist,
      addonVersion: self.version,
      hub: hub
    })
    store.dispatch(actions.loadExperiments(newEnv.name, newEnv.baseUrl))
  })

  notificationManager.schedule(store)
  feedbackManager.start()

  switch (options.loadReason) {
    case 'install':
      store.dispatch(actions.selfEnabled())
      tabs.open({
        url: startEnv.baseUrl + '/onboarding',
        inBackground: true
      })
      break
    case 'enable':
      store.dispatch(actions.selfEnabled())
      break
  }
}

// TODO: write to storage after every change or just onUnload?
// const unsubscribe = store.subscribe(() => storage.root = store.getState())

exports.onUnload = function (reason) {
  switch (reason) {
    case 'disable':
      store.dispatch(actions.selfDisabled())
      break
    case 'uninstall':
      store.dispatch(actions.selfDisabled())
      store.dispatch(actions.uninstallSelf())
      break
  }
  storage.root = store.getState()
  experimentMetrics.destroy()
  addons.destroy()
  webapp.destroy()
  metrics.destroy()
  // unsubscribe()
}

// Need to wait a tick for the ui port to "connect"
ui.once('connected', () => {
  const baseUrl = startEnv.name === 'any' ? store.getState().baseUrl : startEnv.baseUrl
  store.dispatch(actions.loadExperiments(startEnv.name, baseUrl))
})
