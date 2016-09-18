/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { before } = require('sdk/test/utils')
const MockUtils = require('./lib/mock-utils')
const { SYNC_INSTALLED } = require('../common/actionTypes')
const Hub = require('../backend/lib/middleware/Hub')

const mocks = MockUtils.callbacks({
  port: ['on', 'off', 'emit']
})

exports['test connect() events'] = (assert) => {
  const h = new Hub()
  h.connect(mocks.port)
  const onCalls = mocks.port.on.calls()
  assert.equal(onCalls.length, 2)
  assert.equal(onCalls[0][0], 'action')
  assert.equal(onCalls[1][0], 'from-web-to-addon')
  assert.equal(h.ports.size, 1)
  assert.equal(typeof (h.ports.get(mocks.port)), 'function')
}

exports['test disconnect() events'] = (assert) => {
  const h = new Hub()
  h.connect(mocks.port)
  assert.equal(h.ports.size, 1)

  h.disconnect(mocks.port)
  const offCalls = mocks.port.off.calls()
  assert.equal(offCalls.length, 2)
  assert.equal(offCalls[0][0], 'action')
  assert.equal(offCalls[1][0], 'from-web-to-addon')
  assert.equal(h.ports.size, 0)
  assert.equal(typeof (h.ports.get(mocks.port)), 'undefined')
}

exports['test action dispatching'] = (assert, done) => {
  const h = new Hub()
  h.connect(mocks.port)
  h.dispatch = (action) => {
    assert.deepEqual(action, anAction)
    done()
  }
  const anAction = {
    type: 'testAction',
    data: 'testData'
  }
  h.ports.get(mocks.port)(anAction)
}

exports['test basic middleware'] = (assert, done) => {
  const h = new Hub()
  h.connect(mocks.port)
  const middleware = h.middleware()
  const anAction = {
    type: 'testAction',
    data: 'testData'
  }
  const next = action => {
    const emitCalls = mocks.port.emit.calls()
    assert.equal(emitCalls.length, 1)
    assert.equal(emitCalls[0][0], 'action')
    assert.equal(emitCalls[0][1], anAction)
    assert.equal(action.meta.src, 'backend')
    assert.deepEqual(action, anAction)
    done()
  }
  const store = { dispatch: () => {}, getState: () => { return {} } }
  middleware(store)(next)(anAction)
}

exports['test middleware with frontend action'] = (assert, done) => {
  const h = new Hub()
  h.connect(mocks.port)
  const middleware = h.middleware()
  const anAction = {
    type: 'testAction',
    data: 'testData',
    meta: {
      src: 'frontend'
    }
  }
  const next = action => {
    const emitCalls = mocks.port.emit.calls()
    assert.equal(emitCalls.length, 0)
    assert.equal(action.meta.src, 'frontend')
    assert.deepEqual(action, anAction)
    done()
  }
  const store = { dispatch: () => {}, getState: () => { return {} } }
  middleware(store)(next)(anAction)
}

exports['test middleware with web action'] = (assert, done) => {
  const h = new Hub()
  h.connect(mocks.port)
  const middleware = h.middleware()
  const anAction = {
    type: SYNC_INSTALLED,
    payload: {
      clientUUID: 'clientUUID',
      installed: []
    }
  }
  const next = action => {
    const emitCalls = mocks.port.emit.calls()
    assert.equal(emitCalls.length, 2, 'emitted twice')
    assert.equal(emitCalls[0][0], 'action', 'emitted action event')
    assert.equal(emitCalls[0][1], anAction, 'emitted correct action')
    assert.equal(emitCalls[1][0], 'from-addon-to-web', 'emitted from-addon-to-web event')
    const webAction = emitCalls[1][1]
    assert.equal(webAction.type, 'sync-installed-result', 'type')
    assert.equal(webAction.data.clientUUID, anAction.payload.clientUUID, 'clientUUID')
    assert.equal(webAction.data.installed, anAction.payload.installed, 'installed')
    assert.equal(action.meta.src, 'backend', 'meta')
    assert.deepEqual(action, anAction, 'action')
    done()
  }
  const store = { dispatch: () => {}, getState: () => { return {} } }
  middleware(store)(next)(anAction)
}

before(module.exports, function (name, assert, done) {
  MockUtils.resetCallbacks(mocks)
  done()
})

require('sdk/test').run(exports)
