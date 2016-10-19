/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import * as actions from '../../../common/actions'
import { activeExperiments, randomActiveExperiment } from '../reducers/experiments'
import { experimentRating } from '../reducers/ratings'
import { setTimeout, clearTimeout } from 'sdk/timers'
import * as feedbackUI from '../feedbackUI'
import tabs from 'sdk/tabs'
import querystring from 'sdk/querystring'

import type { Experiment } from '../../../common/Experiment'
import type { Dispatch, GetState, ReduxStore } from 'testpilot/types'

const TEN_MINUTES = 1000 * 60 * 10
const ONE_DAY = 1000 * 60 * 60 * 24

function getInterval (installDate: ?Date) {
  installDate = installDate || new Date()
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

export default class FeedbackManager {
  dispatch: Dispatch
  getState: GetState
  dnd: number
  timeout: ?number

  constructor ({ dispatch, getState }: ReduxStore) {
    this.dispatch = dispatch
    this.getState = getState
    this.dnd = ONE_DAY
    this.timeout = null
  }

  schedule ({ delay = TEN_MINUTES }: { delay: number } = {}) {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => { this.check() }, delay)
  }

  check () {
    const state = this.getState()
    if (Date.now() - (state.ratings.lastRated || 0) < this.dnd) {
      return
    }
    const experiment = randomActiveExperiment(state)
    if (!experiment) { return }
    const rating = experimentRating(state, experiment.addon_id)
    const interval = getInterval(experiment.installDate)
    if (interval > 0 && !rating[interval]) {
      this.dispatch(actions.SHOW_RATING_PROMPT({interval, experiment}))
    }
  }

  prompt ({interval, experiment}: {interval: number | string, experiment: Experiment}) {
    return feedbackUI.showRating({ experiment })
      .then(
        rating => {
          if (!rating) { return Promise.resolve() }
          this.dispatch(actions.SET_RATING({experiment, rating, time: Date.now()}))
          return feedbackUI.showSurveyButton({ experiment })
            .then((clicked) => {
              if (clicked) {
                const urlParams = querystring.stringify({
                  id: experiment.addon_id,
                  installed: activeExperiments(this.getState()), // TODO match official output
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
}
