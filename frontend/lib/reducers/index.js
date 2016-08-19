import { combineReducers } from 'redux'
import actionTypes from '../../../common/actionTypes'

function experiments(experiments = {}, action) {
  let x, n
  switch (action.type) {
    case actionTypes.EXPERIMENTS_LOADED:
      return Object.assign({}, action.experiments)

    case actionTypes.EXPERIMENT_ENABLED:
    case actionTypes.INSTALL_ENDED:
      x = experiments[action.experiment.addon_id]
      n = { ...x, active: true }
      return { ...experiments, [n.addon_id]: n }

    case actionTypes.EXPERIMENT_DISABLED:
    case actionTypes.EXPERIMENT_UNINSTALLING:
      x = experiments[action.experiment.addon_id]
      n = { ...x, active: false }
      return { ...experiments, [n.addon_id]: n }

    default:
      return experiments
  }
}

function env(env = null, action) {
  switch (action.type) {
    case actionTypes.EXPERIMENTS_LOADED:
      return action.env
  }
  return env
}

const reducers = combineReducers({
  experiments,
  env
})

export default reducers
