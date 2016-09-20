/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('../../../common/actions')

const FOOTER_HEIGHT = 53
function reducer (state = { panelHeight: FOOTER_HEIGHT }, { payload, type }) {
  switch (type) {
    case actions.SET_BADGE.type:
      return Object.assign({}, state, { badge: payload.text })

    case actions.MAIN_BUTTON_CLICKED.type:
      return Object.assign({}, state, { badge: null, clicked: payload.time })

    case actions.EXPERIMENTS_LOAD_ERROR.type:
      return Object.assign({}, state, { panelHeight: FOOTER_HEIGHT })

    case actions.EXPERIMENTS_LOADED.type:
      const height = (Object.keys(payload.experiments).length * 80) + FOOTER_HEIGHT
      return Object.assign({}, state, { panelHeight: height })

    default:
      return state
  }
}

module.exports = { reducer }
