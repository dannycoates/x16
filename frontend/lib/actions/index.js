/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

import actionTypes from '../../../common/actionTypes'

export function showExperiment (url) {
  return {
    type: actionTypes.SHOW_EXPERIMENT,
    payload: {
      url
    }
  }
}
