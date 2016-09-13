/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../../../common/actionTypes')

function webToAction ({type, data}) {
  switch (type) {
    case 'install-experiment':
      return {
        type: actionTypes.INSTALL_EXPERIMENT,
        payload: {
          experiment: data
        }
      }
    case 'uninstall-experiment':
      return {
        type: actionTypes.UNINSTALL_EXPERIMENT,
        payload: {
          experiment: data
        }
      }
    case 'uninstall-self':
      return {
        type: actionTypes.UNINSTALL_SELF
      }
    case 'sync-installed':
      return {
        type: actionTypes.GET_INSTALLED
      }
    case 'base-url':
      return {
        type: actionTypes.SET_BASE_URL,
        payload: {
          url: data
        }
      }
  }
}

function actionToWeb ({ payload, type }) {
  switch (type) {
    case actionTypes.INSTALL_ENDED:
      return {
        type: 'addon-install:install-ended',
        data: {
          id: payload.experiment.addon_id,
          name: payload.experiment.title,
          version: payload.experiment.version
        }
      }
    case actionTypes.EXPERIMENT_UNINSTALLED:
      return {
        type: 'addon-uninstall:uninstall-ended',
        data: {
          id: payload.experiment.addon_id,
          name: payload.experiment.title,
          version: payload.experiment.version
        }
      }
    case actionTypes.SYNC_INSTALLED:
      return {
        type: 'sync-installed-result',
        data: {
          clientUUID: payload.clientUUID,
          installed: payload.installed
        }
      }
    case actionTypes.EXPERIMENT_ENABLED:
      return {
        type: 'addon-manage:enabled',
        data: {
          id: payload.experiment.addon_id,
          name: payload.experiment.title,
          version: payload.experiment.version
        }
      }
    case actionTypes.EXPERIMENT_DISABLED:
      return {
        type: 'addon-manage:disabled',
        data: {
          id: payload.experiment.addon_id,
          name: payload.experiment.title,
          version: payload.experiment.version
        }
      }
  }
}

module.exports = {
  actionToWeb,
  webToAction
}
