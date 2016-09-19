/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('../actions')
const { Class } = require('sdk/core/heritage')
const notificationUI = require('../notificationUI')
const { setTimeout, clearTimeout } = require('sdk/timers')

const NotificationManager = Class({
  initialize: function (store) {
    this.store = store
    this.timeout = null
  },
  schedule: function () {
    const { getState } = this.store
    const nextCheck = getState().notifications.nextCheck
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      const { experiments } = getState()
      for (let name of Object.keys(experiments)) {
        this.maybeNotify(experiments[name])
      }
    },
    nextCheck - Date.now())
  },
  maybeNotify: function (experiment) {
    const { dispatch, getState } = this.store
    const { lastNotified, nextCheck } = getState().notifications
    const payload = notificationUI.maybeNotify(experiment, lastNotified, nextCheck)
    dispatch(actions.scheduleNotifier(payload.nextCheck, payload.lastNotified))
  }
})

module.exports = NotificationManager
