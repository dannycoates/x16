const { combineReducers } = require('redux')
const actionTypes = require('../../../common/actionTypes')

function experiments(state = {}, action) {
  switch (action.type) {
    case actionTypes.EXPERIMENTS_LOADED:
      return Object.assign({}, action.experiments)
  }
  return state
}

function env(state = null, action) {
  switch (action.type) {
    case actionTypes.EXPERIMENTS_LOADED:
      return action.env
  }
  return state
}

function panelHeight(state = 500, action) {
  if (action.type === actionTypes.CHANGE_PANEL_HEIGHT) {
    return action.height - 20
  }
  return state
}

const reducers = combineReducers({
  experiments,
  panelHeight,
  env
})

module.exports = reducers
