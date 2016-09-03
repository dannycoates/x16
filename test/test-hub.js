const { before } = require('sdk/test/utils')
const MockUtils = require('./lib/mock-utils')
const { SYNC_INSTALLED } = require('../common/actionTypes')
const Hub = require('../backend/lib/middleware/hub')

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
  assert.equal(typeof(h.ports.get(mocks.port)), 'function')
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
  assert.equal(typeof(h.ports.get(mocks.port)), 'undefined')
}

exports['test action dispatching'] = (assert, done) => {
  const h = new Hub()
  h.connect(mocks.port)
  const anAction = {
    type: 'testAction',
    data: 'testData'
  }
  h.on('testAction', action => {
    assert.deepEqual(action, anAction)
    done()
  })
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
  middleware()(next)(anAction)
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
  middleware()(next)(anAction)
}

exports['test middleware with web action'] = (assert, done) => {
  const h = new Hub()
  h.connect(mocks.port)
  const middleware = h.middleware()
  const anAction = {
    type: SYNC_INSTALLED,
    clientUUID: 'clientUUID',
    installed: []
  }
  const next = action => {
    const emitCalls = mocks.port.emit.calls()
    assert.equal(emitCalls.length, 2)
    assert.equal(emitCalls[0][0], 'action')
    assert.equal(emitCalls[0][1], anAction)
    assert.equal(emitCalls[1][0], 'from-addon-to-web')
    const webAction = emitCalls[1][1]
    assert.equal(webAction.type, 'sync-installed-result')
    assert.equal(webAction.data.clientUUID, anAction.clientUUID)
    assert.equal(webAction.data.installed, anAction.installed)
    assert.equal(action.meta.src, 'backend')
    assert.deepEqual(action, anAction)
    done()
  }
  middleware()(next)(anAction)
}


before(module.exports, function(name, assert, done) {
  MockUtils.resetCallbacks(mocks)
  done()
})

require('sdk/test').run(exports)
