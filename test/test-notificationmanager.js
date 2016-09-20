/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { before } = require('sdk/test/utils')
const MockUtils = require('./lib/mock-utils')

const mocks = MockUtils.callbacks({
  store: ['dispatch', 'getState'],
  timers: ['setTimeout', 'clearTimeout'],
  actions: ['MAYBE_NOTIFY', 'SCHEDULE_NOTIFIER'],
  notificationUI: ['maybeNotify']
})

const mockLoader = MockUtils.loader(module, './backend/lib/actionCreators/NotificationManager.js', {
  'sdk/timers': mocks.timers,
  './common/actions.js': mocks.actions,
  './backend/lib/notificationUI.js': mocks.notificationUI
})

const NotificationManager = mockLoader.require('../backend/lib/actionCreators/NotificationManager')
const nm = new NotificationManager(mocks.store)

exports['test schedule'] = (assert) => {
  const nextCheck = Date.now()
  const state = {
    experiments: { x: {}, y: {} },
    notifications: {
      lastNotified: nextCheck - 1,
      nextCheck
    }
  }
  mocks.store.getState.implement(() => state)
  mocks.timers.setTimeout.implement(fn => fn())
  mocks.notificationUI.maybeNotify.implement(() => ({}))

  nm.schedule(mocks.store)

  const setTimeout = mocks.timers.setTimeout.calls()
  const SCHEDULE_NOTIFIER = mocks.actions.SCHEDULE_NOTIFIER.calls()
  const dispatch = mocks.store.dispatch.calls()
  assert.equal(setTimeout.length, 1, 'timer created')
  assert.ok(setTimeout[0][1] < 1000, 'timer is set ok')
  assert.equal(SCHEDULE_NOTIFIER.length, 2, 'actions created')
  assert.equal(dispatch.length, 2, 'actions dispatched')
}

before(module.exports, function (name, assert, done) {
  MockUtils.resetCallbacks(mocks)
  done()
})

require('sdk/test').run(exports)
