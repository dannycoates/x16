/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('./actions')
const { setTimeout, clearTimeout } = require('sdk/timers')

let timeout = null

function createTimer (fn, when) {
  clearTimeout(timeout)
  timeout = setTimeout(fn, when - Date.now())
}

function schedule ({ getState, dispatch }) {
  const nextCheck = getState().notifications.nextCheck
  createTimer(() => {
    const {
      experiments,
      notifications: {
        lastNotified,
        nextCheck
      }
    } = getState()
    for (let name of Object.keys(experiments)) {
      dispatch(actions.maybeNotify(experiments[name], lastNotified, nextCheck))
    }
  },
  nextCheck)
}

module.exports = {
  schedule
}
