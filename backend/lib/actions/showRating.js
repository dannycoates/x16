/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../../../common/actionTypes')
const feedbackUI = require('../feedbackUI')

function setRating (experiment, rating) {
  return {
    type: actionTypes.SET_RATING,
    payload: {
      time: Date.now(),
      experiment,
      rating
    }
  }
}

function showRating (interval, experiment) {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.SHOW_RATING_PROMPT,
      payload: {
        experiment,
        interval
      }
    })
    feedbackUI.showRating({ experiment })
    .then(
      rating => {
        // TODO report rating to server
        dispatch(setRating(experiment, rating))
        feedbackUI.showFeedbackLink(interval, experiment)
      }
    )
    .catch(() => {})
  }
}

module.exports = {
  showRating
}
