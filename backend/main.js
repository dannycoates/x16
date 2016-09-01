/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('./lib/actions');
const {
  SHOW_EXPERIMENT,
  INSTALL_EXPERIMENT,
  UNINSTALL_EXPERIMENT,
  UNINSTALL_SELF,
  SYNC_INSTALLED,
  SET_BASE_URL
} = require('../common/actionTypes');
const AddonListener = require('./lib/AddonListener');
const configureStore = require('./lib/configureStore');
const env = require('./lib/env');
const Hub = require('./lib/hub');
const _ = require('lodash/object');
const { rootStateChanged } = require('./lib/watchers');
const self = require('sdk/self');
const { storage } = require('sdk/simple-storage')
const { UI } = require('./lib/ui');
const Watcher = require('./lib/watcher');
const { WebApp } = require('./lib/webapp');

const hub = new Hub()
const watcher = new Watcher({
  onRoot: rootStateChanged
})

const store = configureStore({hub, watcher})
const addons = new AddonListener(store)
const ui = new UI(store)
const startEnv = env.get()

let webapp = new WebApp({
  baseUrl: startEnv.baseUrl,
  whitelist: startEnv.whitelist,
  addonVersion: self.version,
  hub: hub
})

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

hub.connect(ui.panel.port)
hub.on(SHOW_EXPERIMENT, a => ui.openTab(a.href))
  .on(INSTALL_EXPERIMENT, a => store.dispatch(actions.installExperiment(a.experiment)))
  .on(UNINSTALL_EXPERIMENT, a => store.dispatch(actions.uninstallExperiment(a.experiment)))
  .on(UNINSTALL_SELF, a => store.dispatch(actions.uninstallSelf()))
  .on(SET_BASE_URL, a => {
    // refresh experiments
    const e = env.get()
    const url = e.name === 'any' ? a.url : e.baseUrl
    store.dispatch(actions.loadExperiments(e.name, url))
  })
  .on(SYNC_INSTALLED, a => {
    store.dispatch(actions.syncInstalled({
      clientUUID: store.getState().clientUUID,
      installed: _.pickBy(store.getState().experiments, x => x.active)
    }))
  })

watcher.on('root->ui', change => {
  if (change.prop === 'badge') {
    ui.setBadge()
  }
})

// TODO: write to storage after every change or just onUnload?
// const unsubscribe = store.subscribe(() => storage.root = store.getState())

exports.onUnload = function (reason) {
  storage.root = store.getState()
  addons.destroy()
  webapp.destroy()
  // unsubscribe()
}

// Need to wait a tick for the ui port to "connect"
ui.once('connected', () => {
  const baseUrl = startEnv.name === 'any' ? store.getState().baseUrl : startEnv.baseUrl
  store.dispatch(actions.loadExperiments(startEnv.name, baseUrl))
})
