const actions = require('./actions');
const { setTimeout, clearTimeout } = require('sdk/timers');

let timeout = null;

function createTimer(fn, when) {
  clearTimeout(timeout)
  timeout = setTimeout(fn, when - Date.now())
}

function schedule({ getState, dispatch }) {
  const nextCheck = getState().notifications.nextCheck
  console.debug(`next notify check: ${new Date(nextCheck)}`)
  createTimer(() => {
    const state = getState()
    const {
      experiments,
      notifications: {
        lastNotified,
        nextCheck
      }
    } = state
    for (let name of Object.keys(experiments)) {
      dispatch(actions.maybeNotify(experiments[name], lastNotified, nextCheck))
    }
  },
  nextCheck)
}

module.exports = {
  schedule
}