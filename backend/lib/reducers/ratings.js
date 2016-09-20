/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../../../common/actionTypes')

function reducer (state = {}, { payload, type }) {
  let id, rating
  switch (type) {
    case actionTypes.SHOW_RATING_PROMPT:
      id = payload.experiment.addon_id
      rating = Object.assign({}, state[id], {[payload.interval]: true})
      return Object.assign({}, state, { [id]: rating })

    case actionTypes.SET_RATING:
      id = payload.experiment.addon_id
      rating = Object.assign({}, state[id], { rating: payload.rating })
      return Object.assign({}, state, {
        lastRated: payload.time,
        [id]: rating
      })

    default:
      return state
  }
}

function experimentRating (state, id) {
  return state.ratings[id] || {}
}

module.exports = {
  reducer,
  experimentRating
}
