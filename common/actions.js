/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

function argsOk (actual = {}, expected = []) {
  return Object.keys(actual).every(key => expected.includes(key)) &&
  expected.every(key => actual.hasOwnProperty(key))
}

function createAction (type, payloadArgs) {
  function action (payload = {}, meta = {}) {
    if (!argsOk(payload, payloadArgs)) {
      throw new Error(`Action ${type} expected ${payloadArgs} but got ${payload}`)
    }
    return { type, meta, payload }
  }
  action.type = type
  action.args = payloadArgs
  return action
}

const actionArgs = {
  // backend created
  INSTALL_ENDED: ['experiment'],
  INSTALL_FAILED: ['install'],
  INSTALL_STARTED: ['install'],
  INSTALL_CANCELLED: ['install'],
  DOWNLOAD_STARTED: ['install'],
  DOWNLOAD_PROGRESS: ['install'],
  DOWNLOAD_ENDED: ['install'],
  DOWNLOAD_CANCELLED: ['install'],
  DOWNLOAD_FAILED: ['install'],
  LOAD_EXPERIMENTS: ['envname', 'baseUrl'],
  LOADING_EXPERIMENTS: ['envname'],
  EXPERIMENTS_LOADED: ['envname', 'baseUrl', 'experiments'],
  EXPERIMENTS_LOAD_ERROR: ['err'],
  EXPERIMENT_ENABLED: ['experiment'],
  EXPERIMENT_DISABLED: ['experiment'],
  EXPERIMENT_UNINSTALLING: ['experiment'],
  EXPERIMENT_UNINSTALLED: ['experiment'],
  FRONTEND_CONNECTED: [],
  CHANGE_ENV: [],
  SET_BADGE: ['text'],
  MAIN_BUTTON_CLICKED: ['time'],
  MAYBE_NOTIFY: ['experiment'],
  SHOW_NOTIFICATION: ['id', 'title', 'text', 'url'],
  SCHEDULE_NOTIFIER: ['nextCheck', 'lastNotified'],
  SELF_INSTALLED: ['url'],
  SELF_UNINSTALLED: [],
  SELF_ENABLED: [],
  SELF_DISABLED: [],
  SET_RATING: ['experiment', 'rating', 'time'],
  SHOW_RATING_PROMPT: ['interval', 'experiment'],
  SYNC_INSTALLED: ['clientUUID', 'installed'],
  // frontend created
  SHOW_EXPERIMENT: ['url'],
  // webapp created
  INSTALL_EXPERIMENT: ['experiment'],
  UNINSTALL_EXPERIMENT: ['experiment'],
  UNINSTALL_SELF: [],
  GET_INSTALLED: [],
  SET_BASE_URL: ['url']
}

const actions = {}

for (let [type, args] of Object.entries(actionArgs)) {
  actions[type] = createAction(type, args)
}

module.exports = actions
