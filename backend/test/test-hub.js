
import assert from 'assert'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import Hub from '../lib/middleware/Hub'
import { SYNC_INSTALLED } from '../../common/actions'

const store = {
  dispatch: sinon.spy(),
  getState: sinon.spy()
}


describe('Hub', function () {
  beforeEach(function () {
    store.dispatch.reset()
    store.getState.reset()
  })

  it('initializes', function () {
    const h = new Hub()
    assert.equal(h.ports.size, 0)
  })

  it('connects the proper events', function () {
    const h = new Hub()
    const p = {
      on: sinon.spy()
    }
    h.connect(p)
    assert.ok(p.on.calledTwice)
    assert.ok(p.on.calledWith('action'))
    assert.ok(p.on.calledWith('from-web-to-addon'))
    assert.equal(h.ports.size, 1)
  })

  it('disconnects events', function () {
    const h = new Hub()
    const p = {
      on: sinon.spy(),
      off: sinon.spy()
    }
    h.connect(p)
    assert.equal(h.ports.size, 1)
    h.disconnect(p)
    assert.ok(p.off.calledTwice)
    assert.ok(p.off.calledWith('action'))
    assert.ok(p.off.calledWith('from-web-to-addon'))
    assert.equal(h.ports.size, 0)
  })

  it('emits actions using middleware', function (done) {
    const h = new Hub()
    const p = {
      on: sinon.spy(),
      emit: sinon.spy()
    }
    h.connect(p)
    const middleware = h.middleware()
    const a = {
      type: 'test'
    }
    const next = action => {
      assert.ok(p.emit.calledOnce)
      assert.ok(p.emit.calledWith('action', a))
      assert.equal(a.meta.src, 'backend')
      assert.equal(action, a)
      done()
    }
    middleware(store)(next)(a)
  })

  it('does not re-emit frontend actions', function (done) {
    const h = new Hub()
    const p = {
      on: sinon.spy(),
      emit: sinon.spy()
    }
    h.connect(p)
    const middleware = h.middleware()
    const a = {
      type: 'test',
      meta: {
        src: 'frontend'
      }
    }
    const next = action => {
      assert.ok(!p.emit.called)
      assert.equal(action, a)
      done()
    }
    middleware(store)(next)(a)
  })

  it('emits web actions when needed', function (done) {
    const h = new Hub()
    const p = {
      on: sinon.spy(),
      emit: sinon.spy()
    }
    h.connect(p)
    const middleware = h.middleware()
    const a = {
      type: SYNC_INSTALLED.type,
      payload: {
        clientUUID: 'clientUUID',
        installed: []
      }
    }
    const next = action => {
      assert.ok(p.emit.calledTwice)
      assert.ok(p.emit.calledWith('action', a))
      assert.ok(p.emit.calledWith('from-addon-to-web'))
      assert.equal(action, a)
      done()
    }
    middleware(store)(next)(a)
  })

  it('removes the port on emit failure', function (done) {
    const h = new Hub()
    const p = {
      on: sinon.spy(),
      emit: () => { throw new Error('test') }
    }
    h.connect(p)
    const middleware = h.middleware()
    const a = {
      type: 'test'
    }
    const next = action => {
      assert.equal(h.ports.size, 0)
      done()
    }
    middleware(store)(next)(a)
  })
})