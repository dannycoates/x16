/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */
/* global addon self */
function noop () {}

const fakeStore = {
  dispatch: noop
}

let comm = null

if (typeof (addon) !== 'undefined') {
  comm = addon
} else if (typeof (self) !== 'undefined' && self.port) {
  comm = self
} else {
  comm = {
    port: {
      on: noop,
      emit: noop
    }
  }
}

class Backend {
  constructor () {
    this.store = fakeStore
    this.port = comm.port
    this.port.on('ping', x => this.port.emit('pong', x))
    this.port.on('action', action => this.store.dispatch(action))
  }

  send (action) {
    this.port.emit('action', action)
  }
}

const backend = new Backend()

export default backend
