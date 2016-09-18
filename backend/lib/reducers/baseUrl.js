/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../../../common/actionTypes')

module.exports = function baseUrl (state = null, { payload, type }) {
  switch (type) {
    case actionTypes.EXPERIMENTS_LOADED:
      return payload.baseUrl
    default:
      return state
  }
}

// module.exports = {
//   baseUrl
// }
