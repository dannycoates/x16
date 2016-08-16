/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

Symbol.observable = Symbol('observable');

const aboutConfig = require('sdk/preferences/service');
const actions = require('./lib/actions/experiment');
const AddonListener = require('./lib/AddonListener');
const configureStore = require('./lib/configureStore');
const environments = require('./lib/environments');
const { PrefsTarget } = require('sdk/preferences/event-target');
const self = require('sdk/self');
const { UI } = require('./lib/ui');
const { WebApp } = require('./lib/webapp');

const store = configureStore()
const addons = new AddonListener(store)
const ui = new UI(store)
const prefs = PrefsTarget(); // eslint-disable-line new-cap
let webapp = null

function changeEnv(env) {
  if (webapp) { webapp.destroy() }
  webapp = new WebApp({
    baseUrl: environments[env].baseUrl,
    whitelist: environments[env].whitelist,
    addonVersion: self.version
  })
  // TODO webapp.on()
  store.dispatch(actions.loadExperiments(env));
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

exports.unload = function (reason) {
  addons.destroy()
  webapp.destroy()
}
