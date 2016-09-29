/* global fetch */

const baseUrl = 'http://testpilot.dev:8000'
const commEvents = {}

const port = {
  on: function (name, fn) {
    commEvents[name] = fn
  },
  emit: function (name, data) {
    console.debug(name, data)
  }
}

window.addon = { port }

// mostly copied from backend/lib/actionCreators/Loader.js
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
  experiment.id = experiment.addon_id
  experiment.active = Math.random() > 0.5
  return experiment
}

setTimeout(() =>
fetch(baseUrl + '/api/experiments.json')
  .then(res => res.json())
  .then(json => {
    const experiments = {}
    for (let xp of json.results) {
      experiments[xp.addon_id] = urlify(baseUrl, xp)
    }
    commEvents.action({
      type: 'EXPERIMENTS_LOADED',
      meta: {
        src: 'backend'
      },
      payload: {
        baseUrl: baseUrl,
        env: 'local',
        experiments
      }
    })
  }),
  100)
