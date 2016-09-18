/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { Class } = require('sdk/core/heritage')
const { actionToWeb, webToAction } = require('./webadapter')

const Hub = Class({
  initialize: function () {
    this.dispatch = () => {}
    this.ports = new Map()
    this.context = {}
  },
  connect: function (port) {
    const fn = (action) => this.dispatch(action)
    port.on('action', fn)
    // HACK
    port.on('from-web-to-addon', evt => {
      fn(webToAction(evt))
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
    return ({dispatch}) => {
      this.dispatch = dispatch
      return (next) => (action) => {
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
        return next(action)
      }
    }
  }
})

module.exports = Hub
