/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('../actions')
const { AddonManager } = require('resource://gre/modules/AddonManager.jsm')
const { Class } = require('sdk/core/heritage')
const { Request } = require('sdk/request')
const { setTimeout, clearTimeout } = require('sdk/timers')
const difference = require('lodash/difference')
const WebExtensionChannels = require('../metrics/webextension-channels')

const SIX_HOURS = 6 * 60 * 60 * 1000

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

function mergeAddonState (experiments, addons) {
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
  const addedIds = difference(Object.keys(newSet), Object.keys(oldSet))
  return addedIds.map(id => newSet[id])
}

const Loader = Class({
  initialize: function (store) {
    this.store = store
    this.timeout = null
  },
  schedule: function (interval = SIX_HOURS) {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(
      () => {
        const { env, baseUrl } = this.store.getState()
        this.loadExperiments(env, baseUrl)
      },
      interval
    )
  },
  loadExperiments: function (env, baseUrl) {
    const { dispatch, getState } = this.store
    return fetchExperiments(baseUrl, '/api/experiments.json')
    .then(
      xs => new Promise(
        (resolve) => {
          AddonManager.getAllAddons(
            addons => {
              resolve(mergeAddonState(xs, addons))
            }
          )
        }
      )
    )
    .then(
      xs => {
        const {
          experiments,
          ui: { clicked }
        } = getState()

        const newExperiments = diffExperimentList(experiments, xs)
        for (let x of newExperiments) {
          if ((new Date(x.created)).getTime() > clicked) {
            dispatch(actions.setBadge('New'))
          }
        }

        for (let x of Object.keys(xs).map(n => xs[n])) {
          if (x.active) { WebExtensionChannels.add(x.addon_id) }
          dispatch(actions.maybeNotify(x))
        }
        return xs
      }
    )
    .then(
      xs => dispatch(actions.experimentsLoaded(env, baseUrl, xs)),
      err => dispatch(actions.experimentsLoadError(err))
    )
  }
})

module.exports = Loader
