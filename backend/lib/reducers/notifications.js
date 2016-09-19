/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../../../common/actionTypes')

const tomorrow = Date.now() + (24 * 60 * 60 * 1000)
module.exports = function notifications (
  state = { lastNotified: tomorrow, nextCheck: tomorrow },
  { payload, type }) {
  switch (type) {
    case actionTypes.SCHEDULE_NOTIFIER:
      return Object.assign({}, state, {
        lastNotified: payload.lastNotified,
        nextCheck: payload.nextCheck
      })
    default:
      return state
  }
}
