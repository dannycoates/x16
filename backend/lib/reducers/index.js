const { combineReducers } = require('redux/dist/redux.min')
const actionTypes = require('../../../common/actionTypes')

function experiments(experiments = {}, action) {
  let x, n
  switch (action.type) {
    case actionTypes.LOADING_EXPERIMENTS:
      return {}

    case actionTypes.EXPERIMENTS_LOADED:
      return Object.assign({}, action.experiments)

    case actionTypes.EXPERIMENT_ENABLED:
    case actionTypes.INSTALL_ENDED:
      x = experiments[action.experiment.addon_id]
      n = Object.assign({}, x, { active: true })
      return Object.assign({}, experiments, { [n.addon_id]: n })

    case actionTypes.EXPERIMENT_DISABLED:
    case actionTypes.EXPERIMENT_UNINSTALLING:
      x = experiments[action.experiment.addon_id]
      n = Object.assign({}, x, { active: false })
      return Object.assign({}, experiments, { [n.addon_id]: n })

    default:
      return experiments
  }
}

function env(state = null, action) {
  switch (action.type) {
    case actionTypes.EXPERIMENTS_LOADED:
      return action.env
  }
  return state
}

function baseUrl(state = null, action) {
  switch (action.type) {
    case actionTypes.EXPERIMENTS_LOADED:
      return action.baseUrl
    default:
      return state
  }
}

function panelHeight(state = 53, action) {
  switch (action.type) {
    case actionTypes.LOADING_EXPERIMENTS:
      return 53

    case actionTypes.EXPERIMENTS_LOADED:
      return (Object.keys(action.experiments).length * 80) + 53

    default:
      return state
  }
}

const newUUID = require('sdk/util/uuid').uuid().toString().slice(1, -1)
function clientUUID(state = newUUID, action) {
  return state
}

const reducers = combineReducers({
  experiments,
  panelHeight,
  env,
  baseUrl,
  clientUUID
})

module.exports = reducers
