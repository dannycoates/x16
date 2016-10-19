/* global describe beforeEach it */
import assert from 'assert'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import { SHOW_RATING_PROMPT, SET_RATING } from '../../common/actions'

const TEN_MINUTES = 1000 * 60 * 10
const ONE_DAY = 1000 * 60 * 60 * 24

const timers = {
  setTimeout: sinon.spy(),
  clearTimeout: sinon.spy(),
  '@noCallThru': true
}

const tabs = {
  open: sinon.spy(),
  '@noCallThru': true
}

const querystring = {
  stringify: sinon.stub().returns('qs'),
  '@noCallThru': true
}

const feedbackUI = {
  showRating: sinon.stub().returns(Promise.resolve()),
  showSurveyButton: sinon.stub().returns(Promise.resolve()),
  '@noCallThru': true
}

const store = {
  dispatch: sinon.spy(),
  getState: sinon.stub().returns({})
}
const FeedbackManager = proxyquire(
  '../lib/actionCreators/FeedbackManager',
  {
    'sdk/timers': timers,
    'sdk/tabs': tabs,
    'sdk/querystring': querystring,
    '../feedbackUI': feedbackUI
  }
).default

describe('FeedbackManager', function () {
  beforeEach(function () {
    timers.setTimeout.reset()
    timers.clearTimeout.reset()
    tabs.open.reset()
    store.dispatch.reset()
    store.getState.reset()
    feedbackUI.showRating.reset()
    feedbackUI.showSurveyButton.reset()
  })

  it('initializes', function () {
    const fm = new FeedbackManager(store)
    assert.equal(fm.dispatch, store.dispatch)
    assert.equal(fm.getState, store.getState)
  })

  it('schedules a check', function () {
    const fm = new FeedbackManager(store)
    timers.setTimeout = sinon.stub().returns(99)
    fm.schedule()
    assert.ok(timers.clearTimeout.calledOnce)
    assert.ok(timers.setTimeout.calledOnce)
    assert.equal(timers.setTimeout.firstCall.args[1], TEN_MINUTES)
    assert.equal(fm.timeout, 99)
    timers.setTimeout = sinon.spy()
  })

  describe('check', function () {
    it('does nothing if lastRated < dnd', function () {
      const state = { ratings: { lastRated: (Date.now() - ONE_DAY) + 1000 } }
      const s = {
        getState: sinon.stub().returns(state),
        dispatch: sinon.spy()
      }
      const fm = new FeedbackManager(s)
      fm.check()
      assert.ok(!s.dispatch.called)
    })

    it('does nothing when no experiments are active', function () {
      const state = {
        ratings: { lastRated: Date.now() - (ONE_DAY * 2) },
        experiments: {
          a: { active: false }
        }
      }
      const s = {
        getState: sinon.stub().returns(state),
        dispatch: sinon.spy()
      }
      const fm = new FeedbackManager(s)
      fm.check()
      assert.ok(!s.dispatch.called)
    })

    it('does nothing if the interval was already rated', function () {
      const state = {
        ratings: {
          lastRated: Date.now() - (ONE_DAY * 2),
          a: {
            rating: 5,
            '46': true
          }
        },
        experiments: {
          a: {
            addon_id: 'a',
            active: true,
            installDate: new Date('2015-08-23')
          }
        }
      }
      const s = {
        getState: sinon.stub().returns(state),
        dispatch: sinon.spy()
      }
      const fm = new FeedbackManager(s)
      fm.check()
      assert.ok(!s.dispatch.called)
    })

    it('dispatches a SHOW_RATING_PROMPT when it has to', function () {
      const state = {
        ratings: {
          lastRated: Date.now() - (ONE_DAY * 2)
        },
        experiments: {
          a: {
            addon_id: 'a',
            active: true,
            installDate: new Date('2015-08-23')
          }
        }
      }
      const s = {
        getState: sinon.stub().returns(state),
        dispatch: sinon.spy()
      }
      const fm = new FeedbackManager(s)
      fm.check()
      assert.ok(s.dispatch.calledOnce)
      assert.ok(s.dispatch.firstCall.args[0].type, SHOW_RATING_PROMPT.type)
    })
  })

  describe('prompt', function () {
    it('uses feedbackUI to show the rating prompt', function () {
      const experiment = {}
      const fm = new FeedbackManager(store)
      fm.prompt({experiment})
      assert.ok(feedbackUI.showRating.calledOnce)
      assert.equal(feedbackUI.showRating.firstCall.args[0].experiment, experiment)
    })

    it('dispatches SET_RATING when a rating is set', function (done) {
      feedbackUI.showRating.returns(Promise.resolve(5))
      const experiment = {}
      const fm = new FeedbackManager(store)
      fm.prompt({experiment})
        .then(() => {
          assert.ok(store.dispatch.calledOnce)
          assert.equal(store.dispatch.firstCall.args[0].type, SET_RATING.type)
          feedbackUI.showRating.returns(Promise.resolve())
          done()
        })
    })

    it('shows survey button if rated', function (done) {
      feedbackUI.showRating.returns(Promise.resolve(5))
      const experiment = {}
      const fm = new FeedbackManager(store)
      fm.prompt({experiment})
        .then(() => {
          assert.ok(feedbackUI.showSurveyButton.calledOnce)
          assert.equal(feedbackUI.showSurveyButton.firstCall.args[0].experiment, experiment)
          feedbackUI.showRating.returns(Promise.resolve())
          done()
        })
    })

    it('opens a tab if survey was clicked', function (done) {
      feedbackUI.showRating.returns(Promise.resolve(5))
      feedbackUI.showSurveyButton.returns(Promise.resolve(true))
      const experiment = { addon_id: 'a', survey_url: 'ok' }
      const s = {
        dispatch: sinon.spy(),
        getState: sinon.stub().returns({
          experiments: {}
        })
      }
      const fm = new FeedbackManager(s)
      fm.prompt({experiment})
        .then(() => {
          assert.ok(tabs.open.calledOnce)
          assert.ok(tabs.open.calledWith('ok?qs'))
          feedbackUI.showRating.returns(Promise.resolve())
          feedbackUI.showSurveyButton.returns(Promise.resolve())
          done()
        })
    })

    it('catches and swallows errors', function (done) {
      feedbackUI.showRating.returns(Promise.reject())
      const experiment = {}
      const fm = new FeedbackManager(store)
      fm.prompt({experiment})
        .then(() => {
          done()
        })
    })
  })
})
