/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

import { combineReducers } from 'redux'
import actions from '../../../common/actions'

function experiments (experiments = {}, { payload, type }) {
  let x, n
  switch (type) {
    case actions.EXPERIMENTS_LOAD_ERROR.type:
      return {}

    case actions.EXPERIMENTS_LOADED.type:
      return Object.assign({}, payload.experiments)

    case actions.EXPERIMENT_ENABLED.type:
    case actions.INSTALL_ENDED.type:
      x = experiments[payload.experiment.addon_id]
      n = { ...x, active: true }
      return { ...experiments, [n.addon_id]: n }

    case actions.EXPERIMENT_DISABLED.type:
    case actions.EXPERIMENT_UNINSTALLING.type:
      x = experiments[payload.experiment.addon_id]
      n = { ...x, active: false }
      return { ...experiments, [n.addon_id]: n }

    default:
      return experiments
  }
}

function env (env = null, { payload, type }) {
  switch (type) {
    case actions.EXPERIMENTS_LOADED.type:
      return payload.env
  }
  return env
}

function baseUrl (state = null, { payload, type }) {
  switch (type) {
    case actions.EXPERIMENTS_LOADED.type:
      return payload.baseUrl
  }
  return state
}

const reducers = combineReducers({
  experiments,
  env,
  baseUrl
})

export default reducers
