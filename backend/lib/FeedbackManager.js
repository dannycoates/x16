/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('./actions')
const { Class } = require('sdk/core/heritage')
const { setTimeout } = require('sdk/timers')
const _ = require('lodash/object')

const TEN_MINUTES = 10 * 60 * 1000
const ONE_DAY = 24 * 60 * 60 * 1000
const MINIMUM_NAG_DELAY = ONE_DAY

function randomActiveExperiment (experiments) {
  const installed = _.pickBy(experiments, x => x.active)
  const installedKeys = Object.keys(installed)
  const id = installedKeys[Math.floor(Math.random() * installedKeys.length)]
  return installed[id]
}

function getInterval (installDate) {
  const interval = Math.floor((Date.now() - installDate) / ONE_DAY)
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
  start: function () {
    this.checkTimer = setTimeout(
      () => {
        this.check()
      },
      TEN_MINUTES
    )
  },
  check: function () {
    const { experiments, ratings } = this.store.getState()
    if (Date.now() - ratings.lastRated < MINIMUM_NAG_DELAY) {
      return
    }
    const x = randomActiveExperiment(experiments)
    if (!x) { return }
    const experimentRatings = ratings[x.addon_id]
    const interval = getInterval(x.installDate)
    if (interval > 0 && !experimentRatings[interval]) {
      this.store.dispatch(actions.showRating(interval, x))
    }
  }
})

module.exports = FeedbackManager
