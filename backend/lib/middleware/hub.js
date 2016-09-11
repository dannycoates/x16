/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { Class } = require('sdk/core/heritage')
const { emit, setListeners } = require('sdk/event/core')
const { EventTarget } = require('sdk/event/target')
const { actionToWeb, webToAction } = require('./webadapter')

function handler (hub, port, action) {
  // send to everyone else
  // for (let p of hub.ports.keys()) {
  //   if (p !== port) {
  //     port.emit('action', action)
  //   }
  // }
  emit(hub, action.type, action)
}

const Hub = Class({
  implements: [EventTarget],
  initialize: function (options) {
    setListeners(this, options)
    this.ports = new Map()
  },
  connect: function (port) {
    const fn = handler.bind(null, this, port)
    port.on('action', fn)
    // HACK
    port.on('from-web-to-addon', evt => {
      const action = webToAction(evt)
      console.info(`webapp action ${action.type}`)
      emit(this, action.type, action)
    })
    this.ports.set(port, fn)
  },
  disconnect: function (port) {
    const fn = this.ports.get(port)
    port.off('action', fn)
    port.off('from-web-to-addon')
    this.ports.delete(port)
  },
  middleware: function () {
    return (store) => (next) => (action) => {
      action.meta = action.meta || {}
      action.meta.src = action.meta.src || 'backend'
      if (action.meta.src === 'backend') {
        for (let port of this.ports.keys()) {
          try {
            port.emit('action', action)
            // HACK
            const evt = actionToWeb(action)

            if (evt) {
              port.emit('from-addon-to-web', evt)
            }
          } catch (e) {
            this.ports.delete(port)
          }
        }
      }
      console.info(`backend processing ${action.type}:${action.meta.src}`)
      const result = next(action)
      emit(this, action.type, action)
      return result
    }
  }
})

module.exports = Hub
