/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../../../common/actionTypes')

function syncInstalled ({clientUUID, installed}) {
  return {
    type: actionTypes.SYNC_INSTALLED,
    clientUUID,
    installed
  }
}

function mainButtonClicked () {
  return {
    type: actionTypes.MAIN_BUTTON_CLICKED,
    time: Date.now()
  }
}

function selfEnabled () {
  return {
    type: actionTypes.SELF_ENABLED
  }
}

function selfDisabled () {
  return {
    type: actionTypes.SELF_DISABLED
  }
}

const { maybeNotify } = require('./maybeNotify')
const { loadExperiments, setBadge } = require('./loadExperiments')
const { showRating } = require('./showRating')
const {
  experimentEnabled,
  experimentDisabled,
  experimentUninstalling,
  experimentUninstalled,
  installExperiment,
  uninstallExperiment,
  uninstallSelf
} = require('./installation')

module.exports = {
  experimentEnabled,
  experimentDisabled,
  experimentUninstalling,
  experimentUninstalled,
  installExperiment,
  uninstallExperiment,
  uninstallSelf,
  loadExperiments,
  syncInstalled,
  setBadge,
  mainButtonClicked,
  maybeNotify,
  selfEnabled,
  selfDisabled,
  showRating
}
