/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('../actions')
const actionTypes = require('../../../common/actionTypes')
const { activeExperiments } = require('./experiments')

module.exports = function sideEffects (state = null, { payload, type }) {
  switch (type) {
    case actionTypes.SHOW_EXPERIMENT:
      return ({ui}) => ui.openTab(payload.href)

    case actionTypes.INSTALL_EXPERIMENT:
      return ({dispatch}) => dispatch(actions.installExperiment(payload.experiment))

    case actionTypes.UNINSTALL_EXPERIMENT:
      return ({dispatch}) => dispatch(actions.uninstallExperiment(payload.experiment))

    case actionTypes.UNINSTALL_SELF:
      return ({dispatch}) => dispatch(actions.uninstallSelf())

    case actionTypes.SET_BASE_URL:
      return ({dispatch, env}) => {
        const e = env.get()
        const url = e.name === 'any' ? payload.url : e.baseUrl
        dispatch(actions.loadExperiments(e.name, url))
      }

    case actionTypes.GET_INSTALLED:
      return ({dispatch, getState}) => dispatch(actions.syncInstalled({
        clientUUID: getState().clientUUID,
        installed: activeExperiments(getState())
      }))

    case actionTypes.SET_BADGE:
      return ({ui}) => ui.setBadge()

    case actionTypes.MAIN_BUTTON_CLICKED:
      return ({ui}) => ui.setBadge()

    case actionTypes.MAYBE_NOTIFY:
      return ({dispatch, getState, notificationManager}) => notificationManager.schedule({dispatch, getState})

    default:
      return null
  }
}
