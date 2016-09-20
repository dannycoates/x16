/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('../../../common/actions')
const { activeExperiments, randomActiveExperiment } = require('../reducers/experiments')
const { Class } = require('sdk/core/heritage')
const { experimentRating } = require('../reducers/ratings')
const { setTimeout, clearTimeout } = require('sdk/timers')
const feedbackUI = require('../feedbackUI')
const tabs = require('sdk/tabs')
const querystring = require('sdk/querystring')

const TEN_MINUTES = 1000 * 60 * 10
const ONE_DAY = 1000 * 60 * 60 * 24

function getInterval (installDate) {
  const interval = Math.floor((Date.now() - installDate.getTime()) / ONE_DAY)
  if (interval < 2) {
    return 0
  } else if (interval < 7) {
    return 2
  } else if (interval < 21) {
    return 7
  } else if (interval < 46) {
    return 21
  } else {
    return 46
  }
}

const FeedbackManager = Class({
  initialize: function ({ dispatch, getState, dnd = ONE_DAY }) {
    this.dispatch = dispatch
    this.getState = getState
    this.dnd = dnd
    this.timeout = null
  },
  schedule: function ({ delay = TEN_MINUTES } = {}) {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => { this.check() }, delay)
  },
  check: function () {
    const state = this.getState()
    if (Date.now() - state.ratings.lastRated < this.dnd) {
      return
    }
    const experiment = randomActiveExperiment(state)
    if (!experiment) { return }
    const rating = experimentRating(state, experiment.addon_id)
    const interval = getInterval(experiment.installDate)
    if (interval > 0 && !rating[interval]) {
      this.dispatch(actions.SHOW_RATING_PROMPT({interval, experiment}))
    }
  },
  prompt: function ({interval, experiment}) {
    feedbackUI.showRating({ experiment })
      .then(
        rating => {
          if (!rating) { return Promise.resolve() }
          this.dispatch(actions.SET_RATING({experiment, rating, time: Date.now()}))
          return feedbackUI.showSurveyButton({ experiment })
            .then((clicked) => {
              if (clicked) {
                const urlParams = querystring.stringify({
                  id: experiment.addon_id,
                  installed: Object.keys(activeExperiments(this.getState())),
                  rating,
                  interval
                })
                tabs.open(`${experiment.survey_url}?${urlParams}`)
              }
            })
        }
      )
      .catch(() => {})
  }
})

module.exports = FeedbackManager
