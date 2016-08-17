/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

Symbol.observable = Symbol('observable');

const aboutConfig = require('sdk/preferences/service');
const actions = require('./lib/actions/experiment');
const aTypes = require('../common/actionTypes');
const AddonListener = require('./lib/AddonListener');
const configureStore = require('./lib/configureStore');
const environments = require('../common/environments');
const Hub = require('./lib/hub');
const { PrefsTarget } = require('sdk/preferences/event-target');
const self = require('sdk/self');
const { UI } = require('./lib/ui');
const { WebApp } = require('./lib/webapp');

const hub = new Hub()
const store = configureStore(hub)
const addons = new AddonListener(store)
const ui = new UI(store)
const prefs = PrefsTarget(); // eslint-disable-line new-cap
let webapp = null

hub.connect(ui.panel.port)
hub.on(aTypes.SHOW_EXPERIMENT, a => ui.openTab(a.href))
  .on(aTypes.GET_EXPERIMENTS, a => store.dispatch(actions.getExperiments(a.env)))
  .on(aTypes.CHANGE_PANEL_HEIGHT, a => store.dispatch(a))
  .on(aTypes.INSTALL_EXPERIMENT, a => store.dispatch(actions.installExperiment(a.experiment)))
  .on(aTypes.UNINSTALL_EXPERIMENT, a => store.dispatch(actions.uninstallExperiment(a.experiment)))
  .on(aTypes.SYNC_INSTALLED, a => {
    webapp.send(
      'sync-installed-result',
      {
        // TODO
        clientUUID: require('sdk/util/uuid').uuid().toString().slice(1, -1),
        installed: []
      }
    );
  })

function changeEnv(env) {
  if (webapp) {
    webapp.destroy()
    store.dispatch(actions.loadExperiments(env))
  }
  webapp = new WebApp({
    baseUrl: environments[env].baseUrl,
    whitelist: environments[env].whitelist,
    addonVersion: self.version,
    hub: hub
  })
}

function loadEnv() {
  const env = aboutConfig.get('testpilot.env', 'production');
  if (!aboutConfig.has('testpilot.env')) {
    aboutConfig.set('testpilot.env', env);
  }

  prefs.on('testpilot.env', () => {
    changeEnv(prefs.prefs['testpilot.env']);
  });
  return changeEnv(env);
}

exports.main = function (options) {
  loadEnv();
}

exports.onUnload = function (reason) {
  addons.destroy()
  webapp.destroy()
}
