/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

import actions from '../../../common/actions'

const tomorrow = Date.now() + (24 * 60 * 60 * 1000)

export function reducer (
  state = { lastNotified: tomorrow, nextCheck: tomorrow },
  { payload, type }) {
  switch (type) {
    case actions.SCHEDULE_NOTIFIER.type:
      return Object.assign({}, state, {
        lastNotified: payload.lastNotified,
        nextCheck: payload.nextCheck
      })
    default:
      return state
  }
}
