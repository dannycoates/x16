/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { before } = require('sdk/test/utils')
const MockUtils = require('./lib/mock-utils')

const TEN_MINUTES = 1000 * 60 * 10
const ONE_DAY = 1000 * 60 * 60 * 24

const mocks = MockUtils.callbacks({
  store: ['dispatch', 'getState'],
  timers: ['setTimeout'],
  experiments: ['randomActiveExperiment'],
  ratings: ['experimentRating'],
  actions: ['showRating']
})

const mockLoader = MockUtils.loader(module, './backend/lib/actionCreators/FeedbackManager.js', {
  'sdk/timers': mocks.timers,
  './backend/lib/reducers/experiments.js': mocks.experiments,
  './backend/lib/actions.js': mocks.actions,
  './backend/lib/reducers/ratings.js': mocks.ratings
})

const FeedbackManager = mockLoader.require('../backend/lib/actionCreators/FeedbackManager')

exports['test initialize'] = (assert) => {
  const fm = new FeedbackManager(mocks.store)
  assert.equal(fm.dispatch, mocks.store.dispatch, 'dispatch is set')
  assert.equal(fm.getState, mocks.store.getState, 'getState is set')
  assert.equal(fm.dnd, ONE_DAY, 'dnd defaults to 1 day')
}

exports['test schedule'] = (assert) => {
  const fm = new FeedbackManager(mocks.store)
  mocks.timers.setTimeout.implement(() => 99)
  fm.schedule()
  assert.equal(fm.checkTimer, 99, 'checkTimer is set by setTimeout')
  const calls = mocks.timers.setTimeout.calls()
  assert.equal(calls.length, 1, 'setTimeout was called')
  assert.equal(calls[0][1], TEN_MINUTES, 'delay defaults to 10 minutes')
}

exports['test lastRated < dnd'] = (assert) => {
  const fm = new FeedbackManager(mocks.store)
  const lastRated = (Date.now() - ONE_DAY) + 1000
  mocks.store.getState.implement(() => { return { ratings: { lastRated } } })
  fm.check()
  const calls = mocks.experiments.randomActiveExperiment.calls()
  assert.equal(calls.length, 0, 'check returned already')
}

exports['test no active experiments'] = (assert) => {
  const fm = new FeedbackManager(mocks.store)
  const lastRated = (Date.now() - ONE_DAY) - 1000
  mocks.store.getState.implement(() => { return { ratings: { lastRated } } })
  mocks.experiments.randomActiveExperiment.implement(() => null)
  fm.check()
  const calls = mocks.ratings.experimentRating.calls()
  assert.equal(calls.length, 0, 'check returned already')
}

exports['test open interval'] = (assert) => {
  const x = { installDate: new Date(Date.now() - (ONE_DAY * 2)) }
  const fm = new FeedbackManager(mocks.store)
  const lastRated = (Date.now() - ONE_DAY) - 1000
  mocks.store.getState.implement(() => { return { ratings: { lastRated } } })
  mocks.experiments.randomActiveExperiment.implement(() => x)
  mocks.ratings.experimentRating.implement(() => { return {} })
  fm.check()
  const showRating = mocks.actions.showRating.calls()
  const dispatch = mocks.store.dispatch.calls()
  assert.equal(showRating.length, 1, 'action was created')
  assert.equal(showRating[0][0], 2, 'interval is correct')
  assert.equal(showRating[0][1], x, 'experiment was passed')
  assert.equal(dispatch.length, 1, 'action was dispatched')
}

exports['test completed interval does not dispatch'] = (assert) => {
  const x = { installDate: new Date(Date.now() - (ONE_DAY * 2)) }
  const fm = new FeedbackManager(mocks.store)
  const lastRated = (Date.now() - ONE_DAY) - 1000
  mocks.store.getState.implement(() => { return { ratings: { lastRated } } })
  mocks.experiments.randomActiveExperiment.implement(() => x)
  mocks.ratings.experimentRating.implement(() => { return { '2': true } })
  fm.check()
  const showRating = mocks.actions.showRating.calls()
  const dispatch = mocks.store.dispatch.calls()
  assert.equal(showRating.length, 0, 'action was not created')
  assert.equal(dispatch.length, 0, 'action was not dispatched')
}

before(module.exports, function (name, assert, done) {
  MockUtils.resetCallbacks(mocks)
  done()
})

require('sdk/test').run(exports)
