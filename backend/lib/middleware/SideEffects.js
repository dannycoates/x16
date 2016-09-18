/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { Class } = require('sdk/core/heritage')
const { setTimeout } = require('sdk/timers')

const SideEffects = Class({
  initialize: function () {
    this.context = {}
  },
  middleware: function () {
    return (store) => (next) => (action) => {
      const result = next(action)
      const { sideEffects } = store.getState()
      if (typeof (sideEffects) === 'function') {
        setTimeout(sideEffects, 0, Object.assign({}, store, this.context))
      }
      return result
    }
  }
})

module.exports = SideEffects
