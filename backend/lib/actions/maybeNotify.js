/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../../../common/actionTypes')
const notificationUI = require('../notificationUI')

function maybeNotify (experiment, lastNotified, nextCheck) {
  const action = notificationUI.maybeNotify(experiment, lastNotified, nextCheck)
  return {
    type: actionTypes.MAYBE_NOTIFY,
    payload: action
  }
}

module.exports = {
  maybeNotify
}
