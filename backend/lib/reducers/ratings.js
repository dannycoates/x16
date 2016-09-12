/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../../../common/actionTypes')

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

function experimentRating(state, id) {
  return state.ratings[id] || {}
}

module.exports = {
  ratings,
  experimentRating
}
