/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import * as actions from '../../../common/actions'

import type { Action } from 'testpilot/types'

const FOOTER_HEIGHT = 53
const EXPERIMENT_HEIGHT = 80

export function reducer (state: Object = { panelHeight: FOOTER_HEIGHT }, { payload, type }: Action) {
  switch (type) {
    case actions.SET_BADGE.type:
      return Object.assign({}, state, { badge: payload.text })

    case actions.MAIN_BUTTON_CLICKED.type:
      return Object.assign({}, state, { badge: null, clicked: payload.time })

    case actions.EXPERIMENTS_LOAD_ERROR.type:
      return Object.assign({}, state, { panelHeight: FOOTER_HEIGHT })

    case actions.EXPERIMENTS_LOADED.type:
      const panelHeight = Math.min(
        (Object.keys(payload.experiments).length * EXPERIMENT_HEIGHT) + FOOTER_HEIGHT,
        (4 * EXPERIMENT_HEIGHT) + 56 + FOOTER_HEIGHT)
      return Object.assign({}, state, { panelHeight })

    default:
      return state
  }
}
