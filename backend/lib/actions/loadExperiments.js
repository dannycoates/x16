/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../../../common/actionTypes')
const { AddonManager } = require('resource://gre/modules/AddonManager.jsm')
const { maybeNotify } = require('./maybeNotify')
const { Request } = require('sdk/request')
const _ = require('lodash')
const WebExtensionChannels = require('../metrics/webextension-channels')

function setBadge (text) {
  return {
    type: actionTypes.SET_BADGE,
    text
  }
}

function loadingExperiments (env) {
  return {
    type: actionTypes.LOADING_EXPERIMENTS,
    env
  }
}

function experimentsLoaded (env, baseUrl, experiments) {
  return {
    type: actionTypes.EXPERIMENTS_LOADED,
    env,
    baseUrl,
    experiments
  }
}

function experimentsLoadError (res) {
  return {
    type: actionTypes.EXPERIMENTS_LOAD_ERROR,
    res
  }
}

function urlify (baseUrl, experiment) {
  const urlFields = {
    '': ['thumbnail', 'url', 'html_url', 'installations_url', 'survey_url'],
    details: ['image'],
    tour_steps: ['image'],
    contributors: ['avatar']
  }
  Object.keys(urlFields).forEach(key => {
    const items = (key === '') ? [experiment] : experiment[key]
    items.forEach(item => urlFields[key].forEach(field => {
      // If the URL is not absolute, prepend the environment's base URL.
      if (item[field].substr(0, 1) === '/') {
        item[field] = baseUrl + item[field]
      }
    }))
  })
  return experiment
}

function fetchExperiments (baseUrl, path) {
  return new Promise(
    (resolve, reject) => {
      const r = new Request({
        headers: { 'Accept': 'application/json' },
        url: baseUrl + path
      })
      r.on(
        'complete',
        res => {
          if (res.status === 200) {
            const experiments = {}
            for (let xp of res.json.results) {
              experiments[xp.addon_id] = urlify(baseUrl, xp)
            }
            resolve(experiments)
          } else {
            reject(res)
          }
        }
      )
      r.get()
    }
  )
}

function mergeAddonActiveState (experiments, addons) {
  Object.keys(experiments).forEach(k => { experiments[k].active = false })
  for (let addon of addons) {
    const x = experiments[addon.id]
    if (x) {
      x.active = true
      x.installDate = addon.installDate
    }
  }
  return experiments
}

function diffExperimentList (oldSet, newSet) {
  const addedIds = _.difference(Object.keys(newSet), Object.keys(oldSet))
  return addedIds.map(id => newSet[id])
}

function loadExperiments (newEnv, baseUrl) {
  return (dispatch, getState) => {
    dispatch(loadingExperiments(newEnv))
    return fetchExperiments(baseUrl, '/api/experiments.json')
      .then(
        xs => new Promise(
          (resolve, reject) => {
            AddonManager.getAllAddons(
              addons => {
                resolve(mergeAddonActiveState(xs, addons))
              }
            )
          }
        )
      )
      .then(
        xs => {
          const {
            experiments,
            ui: { clicked },
            notifications: { lastNotified, nextCheck }
          } = getState()

          const newExperiments = diffExperimentList(experiments, xs)
          for (let x of newExperiments) {
            if ((new Date(x.created)).getTime() > clicked) {
              dispatch(setBadge('New'))
            }
          }

          for (let x of _.values(xs)) {
            if (x.active) { WebExtensionChannels.add(x.addon_id) }
            dispatch(maybeNotify(x, lastNotified, nextCheck))
          }
          return xs
        }
      )
      .then(
        xs => dispatch(experimentsLoaded(newEnv, baseUrl, xs)),
        err => dispatch(experimentsLoadError(err))
      )
  }
}

module.exports = {
  loadExperiments,
  setBadge
}
