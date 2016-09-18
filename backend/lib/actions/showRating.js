/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../../../common/actionTypes')
const { activeExperiments } = require('../reducers/experiments')
const feedbackUI = require('../feedbackUI')
const tabs = require('sdk/tabs')
const querystring = require('sdk/querystring')

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
        if (!rating) { return Promise.resolve() }
        const urlParams = querystring.stringify({
          id: experiment.addon_id,
          installed: Object.keys(activeExperiments(getState())),
          rating,
          interval
        })
        const surveyUrl = `${experiment.survey_url}?${urlParams}`
        dispatch(setRating(experiment, rating))
        return feedbackUI.showSurveyButton({ experiment })
          .then((clicked) => {
            if (clicked) {
              tabs.open(surveyUrl)
            }
          })
      }
    )
    .catch(() => {})
  }
}

module.exports = {
  showRating
}
