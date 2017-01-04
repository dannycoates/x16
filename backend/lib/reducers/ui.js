/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import * as actions from '../../../common/actions'

import type { Action } from 'testpilot/types'

export function reducer (state: Object = { badge: null, clicked: Date.now() }, { payload, type }: Action) {
  switch (type) {
    case actions.SET_BADGE.type:
      return Object.assign({}, state, { badge: payload.text })

    case actions.MAIN_BUTTON_CLICKED.type:
      return Object.assign({}, state, { badge: null, clicked: payload.time })

    default:
      return state
  }
}
