/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { before } = require('sdk/test/utils')
const MockUtils = require('./lib/mock-utils')

const mocks = MockUtils.callbacks({
  AddonManager: ['addAddonListener', 'removeAddonListener'],
  store: ['dispatch', 'getState'],
  actions: ['EXPERIMENT_ENABLED', 'EXPERIMENT_DISABLED', 'EXPERIMENT_UNINSTALLING', 'EXPERIMENT_UNINSTALLED']
})

const mockLoader = MockUtils.loader(module, './backend/lib/actionCreators/AddonListener.js', {
  'resource://gre/modules/AddonManager.jsm': {
    AddonManager: mocks.AddonManager
  },
  './common/actions.js': mocks.actions
})

const AddonListener = mockLoader.require('../backend/lib/actionCreators/AddonListener')

exports['test initialize'] = (assert) => {
  const l = new AddonListener(mocks.store)
  const calls = mocks.AddonManager.addAddonListener.calls()
  assert.equal(calls.length, 1, 'called addAddonListener')
  assert.equal(calls[0][0], l, 'this passed to addAddonListener')
  assert.equal(l.dispatch, mocks.store.dispatch, 'dispatch was set')
}

function testListeners (assert, listener, addon) {
  const experiment = {}
  const getState = () => { return { experiments: { x: experiment } } }
  const listeners = new Map([
    ['onEnabled', 'EXPERIMENT_ENABLED'],
    ['onDisabled', 'EXPERIMENT_DISABLED'],
    ['onUninstalling', 'EXPERIMENT_UNINSTALLING'],
    ['onUninstalled', 'EXPERIMENT_UNINSTALLED']
  ])
  const dispatch = mocks.store.dispatch.calls()

  for (let [event, action] of listeners) {
    mocks.store.getState.implement(getState)
    listener[event](addon)
    const a = mocks.actions[action].calls()
    if (addon.id === 'x') {
      assert.equal(dispatch.length, 1, 'dispatch called')
      assert.equal(a.length, 1, `${action} called`)
      assert.equal(a[0][0].experiment, experiment, `experiment passed to ${action}`)
    } else {
      assert.equal(dispatch.length, 0, 'dispatch not called')
      assert.equal(a.length, 0, `${action} not called`)
    }
    MockUtils.resetCallbacks(mocks)
  }
}

exports['test listeners with experiment'] = assert => {
  testListeners(assert, new AddonListener(mocks.store), { id: 'x' })
}

exports['test listeners without experiment'] = assert => {
  testListeners(assert, new AddonListener(mocks.store), { id: 'y' })
}

exports['test onOperationCancelled with pending enable'] = assert => {
  const experiment = {}
  const getState = () => { return { experiments: { x: experiment } } }
  mocks.store.getState.implement(getState)
  mocks.AddonManager.PENDING_ENABLE = 1
  const l = new AddonListener(mocks.store)

  l.onOperationCancelled({ id: 'x', pendingOperations: 1 })

  const dispatch = mocks.store.dispatch.calls()
  const EXPERIMENT_ENABLED = mocks.actions.EXPERIMENT_ENABLED.calls()
  assert.equal(dispatch.length, 1, 'dispatch called')
  assert.equal(EXPERIMENT_ENABLED.length, 1, 'EXPERIMENT_ENABLED called')
  assert.equal(EXPERIMENT_ENABLED[0][0].experiment, experiment, 'experiment passed to EXPERIMENT_ENABLED')
  delete mocks.AddonManager.PENDING_ENABLE
}

exports['test onOperationCancelled without pending enable'] = assert => {
  const experiment = {}
  const getState = () => { return { experiments: { x: experiment } } }
  mocks.store.getState.implement(getState)
  mocks.AddonManager.PENDING_ENABLE = 1
  const l = new AddonListener(mocks.store)

  l.onOperationCancelled({ id: 'x', pendingOperations: 0 })

  const dispatch = mocks.store.dispatch.calls()
  const EXPERIMENT_ENABLED = mocks.actions.EXPERIMENT_ENABLED.calls()
  assert.equal(dispatch.length, 0, 'dispatch not called')
  assert.equal(EXPERIMENT_ENABLED.length, 0, 'EXPERIMENT_ENABLED not called')
  delete mocks.AddonManager.PENDING_ENABLE
}

exports['test teardown'] = assert => {
  const l = new AddonListener(mocks.store)
  l.teardown()
  const calls = mocks.AddonManager.removeAddonListener.calls()
  assert.equal(calls.length, 1, 'called removeAddonListener')
  assert.equal(calls[0][0], l, 'this passed to removeAddonListener')
}

before(module.exports, function (name, assert, done) {
  MockUtils.resetCallbacks(mocks)
  done()
})

require('sdk/test').run(exports)
