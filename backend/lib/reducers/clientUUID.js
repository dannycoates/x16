/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */
import { uuid } from 'sdk/util/uuid'

const newUUID = uuid().toString().slice(1, -1)
export function reducer (state = newUUID, action) {
  return state
}
