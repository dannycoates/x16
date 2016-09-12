/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('./actions')
const { Class } = require('sdk/core/heritage')
const { experimentRating } = require('./reducers/ratings')
const { setTimeout } = require('sdk/timers')
const { randomActiveExperiment } = require('./reducers/experiments')

const TEN_MINUTES = 1000 * 60 * 10
const ONE_DAY = 1000 * 60 * 60 * 24

function getInterval (installDate) {
  const interval = Math.floor((Date.now() - installDate.getTime()) / ONE_DAY)
  console.debug(`feedback ${interval} : ${installDate}`)
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
  initialize: function (store) {
    this.store = store
  },
  start: function ({delay = TEN_MINUTES, dnd = ONE_DAY} = {}) {
    this.dnd = dnd
    this.checkTimer = setTimeout(() => { this.check() }, delay)
  },
  check: function () {
    const state = this.store.getState()
    if (Date.now() - state.ratings.lastRated < this.dnd) {
      return
    }
    const x = randomActiveExperiment(state)
    if (!x) { return }
    const rating = experimentRating(state, x.addon_id)
    const interval = getInterval(x.installDate)
    if (interval > 0 && !rating[interval]) {
      this.store.dispatch(actions.showRating(interval, x))
    }
  }
})

module.exports = FeedbackManager