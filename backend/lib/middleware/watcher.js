/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { Class } = require('sdk/core/heritage')
const { emit, setListeners } = require('sdk/event/core')
const { EventTarget } = require('sdk/event/target')
const { observableDiff } = require('deep-diff')

function toType (kind) {
  switch (kind) {
    case 'N': return 'ADD'
    case 'D': return 'DELETE'
    case 'E': return 'EDIT'
    case 'A': return 'ARRAY'
  }
}

function diffState (watcher, previous, current) {
  observableDiff(
    previous,
    current,
    function (diff) {
      const target = ['root'].concat(diff.path.slice(0, diff.path.length - 1))
      const targetEvent = target.join('->')
      // console.debug(`change ${targetEvent}:${diff.path[diff.path.length - 1]}`)
      emit(
        watcher,
        targetEvent,
        {
          target: targetEvent,
          prop: diff.path[diff.path.length - 1],
          previous: diff.lhs,
          current: diff.rhs,
          type: toType(diff.kind)
        }
      )
    }
  )
}

const Watcher = Class({
  implements: [EventTarget],
  initialize: function (options) {
    setListeners(this, options)
  },
  middleware: function (initialState) {
    return (store) => {
      this.store = store
      // kick off a diff to initialize the root watcher
      diffState(this, {}, initialState)

      return (next) => (action) => {
        const previousState = store.getState()
        const result = next(action)
        const currentState = store.getState()
        diffState(this, previousState, currentState)
        return result
      }
    }
  }
})

module.exports = Watcher
