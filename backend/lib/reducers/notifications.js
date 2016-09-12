/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../../../common/actionTypes')

const tomorrow = Date.now() + (24 * 60 * 60 * 1000)
function notifications (state = { lastNotified: tomorrow, nextCheck: tomorrow }, action) {
  switch (action.type) {
    case actionTypes.MAYBE_NOTIFY:
      return Object.assign({}, state, {
        lastNotified: action.lastNotified,
        nextCheck: action.nextCheck
      })
    default:
      return state
  }
}

module.exports = {
  notifications
}
