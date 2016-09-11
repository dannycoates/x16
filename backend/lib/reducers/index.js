/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { combineReducers } = require('redux/dist/redux.min')
const actionTypes = require('../../../common/actionTypes')

function experiments (experiments = null, action) {
  let x, n
  switch (action.type) {
    case actionTypes.EXPERIMENTS_LOAD_ERROR:
      return {}

    case actionTypes.EXPERIMENTS_LOADED:
      return Object.assign({}, action.experiments)

    case actionTypes.EXPERIMENT_ENABLED:
    case actionTypes.INSTALL_ENDED:
      x = experiments[action.experiment.addon_id]
      n = Object.assign({}, x, { active: true, installDate: action.experiment.installDate })
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

function env (state = null, action) {
  switch (action.type) {
    case actionTypes.EXPERIMENTS_LOADED:
      return action.env
    default:
      return state
  }
}

function baseUrl (state = null, action) {
  switch (action.type) {
    case actionTypes.EXPERIMENTS_LOADED:
      return action.baseUrl
    default:
      return state
  }
}

const newUUID = require('sdk/util/uuid').uuid().toString().slice(1, -1)
function clientUUID (state = newUUID, action) {
  return state
}

const FOOTER_HEIGHT = 53
function ui (state = { panelHeight: FOOTER_HEIGHT }, action) {
  switch (action.type) {
    case actionTypes.SET_BADGE:
      return Object.assign({}, state, { badge: action.text })

    case actionTypes.MAIN_BUTTON_CLICKED:
      return Object.assign({}, state, { badge: null, clicked: action.time })

    case actionTypes.EXPERIMENTS_LOAD_ERROR:
      return Object.assign({}, state, { panelHeight: FOOTER_HEIGHT })

    case actionTypes.EXPERIMENTS_LOADED:
      const height = (Object.keys(action.experiments).length * 80) + FOOTER_HEIGHT
      return Object.assign({}, state, { panelHeight: height })

    default:
      return state
  }
}

const tomorrow = Date.now() + (24 * 60 * 60 * 1000)
function notifications (state = { lastNotified: tomorrow, nextCheck: tomorrow }, action) {
  switch (action.type) {
    case actionTypes.MAYBE_NOTIFY:
      return Object.assign({}, state, {
        lastNotified: action.lastNotified,
        nextCheck: action.nextCheck
      })
    default:
      return state
  }
}

function ratings (state = {}, action) {
  let id, rating
  switch (action.type) {
    case actionTypes.SHOW_RATING_PROMPT:
      id = action.experiment.addon_id
      rating = Object.assign({}, state[id], {[action.interval]: true})
      return Object.assign({}, state, { [id]: rating })

    case actionTypes.SET_RATING:
      id = action.experiment.addon_id
      rating = Object.assign({}, state[id], { rating: action.rating })
      console.debug(`${id} rated: ${action.rating}`)
      return Object.assign({}, state, {
        lastRated: action.time,
        [id]: rating
      })

    default:
      return state
  }
}

const reducers = combineReducers({
  experiments,
  env,
  baseUrl,
  clientUUID,
  ui,
  notifications,
  ratings
})

module.exports = reducers
