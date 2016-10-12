/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */
/* global addon self */

// @flow

import type { Action } from 'testpilot/types'

function noop () {}

const fakeStore = {
  dispatch: noop
}

let comm = {
  port: {
    on: noop,
    emit: noop
  }
}

// $FlowFixMe addon is a global
if (typeof (addon) !== 'undefined') {
  comm = addon
} else if (typeof (self) !== 'undefined' && self.port) {
  comm = self
}

export default class Backend {
  store: {
    dispatch: (action: Action) => void
  }
  port: {
    on: (type: string, handler: Function) => any,
    emit: (type: string, ...args: any) => void
  }

  constructor () {
    this.store = fakeStore
    this.port = comm.port
    this.port.on('ping', (x: number) => this.port.emit('pong', x))
    this.port.on('action', (action: Action) => this.store.dispatch(action))
  }

  send (action: Action) {
    this.port.emit('action', action)
  }
}
