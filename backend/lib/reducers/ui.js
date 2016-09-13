/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../../../common/actionTypes')

const FOOTER_HEIGHT = 53
function ui (state = { panelHeight: FOOTER_HEIGHT }, { payload, type }) {
  switch (type) {
    case actionTypes.SET_BADGE:
      return Object.assign({}, state, { badge: payload.text })

    case actionTypes.MAIN_BUTTON_CLICKED:
      return Object.assign({}, state, { badge: null, clicked: payload.time })

    case actionTypes.EXPERIMENTS_LOAD_ERROR:
      return Object.assign({}, state, { panelHeight: FOOTER_HEIGHT })

    case actionTypes.EXPERIMENTS_LOADED:
      const height = (Object.keys(payload.experiments).length * 80) + FOOTER_HEIGHT
      return Object.assign({}, state, { panelHeight: height })

    default:
      return state
  }
}

module.exports = {
  ui
}
