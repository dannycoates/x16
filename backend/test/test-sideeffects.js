/* global describe beforeEach it */
import assert from 'assert'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

const spies = {
  add: sinon.spy(),
  remove: sinon.spy(),
  '@noCallThru': true
}
const sideEffects = proxyquire(
  '../lib/reducers/sideEffects',
  {
    '../metrics/webextension-channels': spies
  }
)
const { reducer, nothing } = sideEffects

import * as actions from '../../common/actions'
import { Experiment } from '../../common/Experiment'

const X = new Experiment({
  addon_id: 'X'
})

describe('side effects', function () {
  describe('reducer', function () {
    beforeEach(
      function () {
        spies.add.reset()
        spies.remove.reset()
      }
    )

    it('handles EXPERIMENTS_LOADED', function (done) {
      const action = {
        type: actions.EXPERIMENTS_LOADED.type
      }
      const loader = {
        schedule: done
      }
      const state = reducer(null, action)
      state({loader})
    })

    it('handles EXPERIMENTS_LOAD_ERROR', function () {
      const action = {
        type: actions.EXPERIMENTS_LOAD_ERROR.type
      }
      const state = reducer(null, action)
      assert.equal(state, nothing)
    })

    it('handles INSTALL_ENDED', function () {
      const action = {
        type: actions.INSTALL_ENDED.type,
        payload: {
          experiment: X
        }
      }
      const telemetry = {
        ping: (id, name) => {
          assert.equal(id, X.addon_id)
          assert.equal(name, 'enabled')
        }
      }
      const state = reducer(null, action)
      state({telemetry})
      assert.ok(spies.add.calledOnce, 'added channel')
      assert.ok(spies.add.calledWith(X.addon_id), 'passed correct id')
    })

    it('handles EXPERIMENT_ENABLED', function () {
      const action = {
        type: actions.EXPERIMENT_ENABLED.type,
        payload: {
          experiment: X
        }
      }
      const telemetry = {
        ping: (id, name) => {
          assert.equal(id, X.addon_id)
          assert.equal(name, 'enabled')
        }
      }
      const state = reducer(null, action)
      state({telemetry})
      assert.ok(spies.add.calledOnce, 'added channel')
      assert.ok(spies.add.calledWith(X.addon_id), 'passed correct id')
    })

    it('handles EXPERIMENT_DISABLED', function () {
      const action = {
        type: actions.EXPERIMENT_DISABLED.type,
        payload: {
          experiment: X
        }
      }
      const telemetry = {
        ping: (id, name) => {
          assert.equal(id, X.addon_id)
          assert.equal(name, 'disabled')
        }
      }
      const state = reducer(null, action)
      state({telemetry})
      assert.ok(spies.remove.calledOnce, 'removed channel')
      assert.ok(spies.remove.calledWith(X.addon_id), 'passed correct id')
    })

    it('handles EXPERIMENT_UNINSTALLING', function () {
      const action = {
        type: actions.EXPERIMENT_UNINSTALLING.type,
        payload: {
          experiment: X
        }
      }
      const telemetry = {
        ping: (id, name) => {
          assert.equal(id, X.addon_id)
          assert.equal(name, 'disabled')
        }
      }
      const state = reducer(null, action)
      state({telemetry})
      assert.ok(spies.remove.calledOnce, 'removed channel')
      assert.ok(spies.remove.calledWith(X.addon_id), 'passed correct id')
    })

    it('handles SET_BADGE', function (done) {
      const action = {
        type: actions.SET_BADGE.type
      }
      const ui = {
        setBadge: done
      }
      const state = reducer(null, action)
      assert.equal(typeof (state), 'function')
      state({ ui })
    })

    it('handles MAIN_BUTTON_CLICKED', function () {
      const action = {
        type: actions.MAIN_BUTTON_CLICKED.type
      }
      const baseUrl = 'testUrl'
      const getState = () => ({ baseUrl })
      const ui = {
        setBadge: () => {}
      }
      const telemetry = {
        ping: (id, name) => {
          assert.equal(id, 'txp_toolbar_menu_1')
          assert.equal(name, 'clicked')
        }
      }
      const tabs = {
        open: (x) => {
          assert.equal(x.url, baseUrl)
        }
      }
      const state = reducer(null, action)
      assert.equal(typeof (state), 'function')
      state({ ui, telemetry, tabs, getState })
    })

    it('handles SCHEDULE_NOTIFIER', function (done) {
      const action = {
        type: actions.SCHEDULE_NOTIFIER.type
      }
      const notificationManager = {
        schedule: done
      }
      const state = reducer(null, action)
      assert.equal(typeof (state), 'function')
      state({ notificationManager })
    })

    it('handles SET_RATING', function () {
      const action = {
        type: actions.SET_RATING.type
      }
      const state = reducer(null, action)
      assert.equal(state, nothing)
    })

    it('handles SHOW_RATING_PROMPT', function (done) {
      const action = {
        type: actions.SHOW_RATING_PROMPT.type
      }
      const feedbackManager = {
        prompt: () => done()
      }
      const state = reducer(null, action)
      state({feedbackManager})
    })

    it('handles INSTALL_EXPERIMENT', function () {
      const action = {
        type: actions.INSTALL_EXPERIMENT.type,
        payload: {
          experiment: {}
        }
      }
      const installManager = {
        installExperiment: (x) => assert.equal(x, action.payload.experiment)
      }
      const state = reducer(null, action)
      assert.equal(typeof (state), 'function')
      state({ installManager })
    })

    it('handles UNINSTALL_EXPERIMENT', function () {
      const action = {
        type: actions.UNINSTALL_EXPERIMENT.type,
        payload: {
          experiment: {}
        }
      }
      const installManager = {
        uninstallExperiment: (x) => assert.equal(x, action.payload.experiment)
      }
      const state = reducer(null, action)
      assert.equal(typeof (state), 'function')
      state({ installManager })
    })

    it('handles UNINSTALL_SELF', function (done) {
      const action = {
        type: actions.UNINSTALL_SELF.type
      }
      const installManager = {
        uninstallSelf: done
      }
      const state = reducer(null, action)
      assert.equal(typeof (state), 'function')
      state({ installManager })
    })

    it('handles SELF_INSTALLED', function () {
      const action = {
        type: actions.SELF_INSTALLED.type,
        payload: {
          url: 'it'
        }
      }
      const self = { id: 1 }
      const telemetry = {
        ping: (id, name) => {
          assert.equal(name, 'enabled')
        },
        setPrefs: () => {}
      }
      const tabs = {
        open: it => assert.equal(it.url, action.payload.url)
      }
      const state = reducer(null, action)
      assert.equal(typeof (state), 'function')
      state({self, telemetry, tabs})
    })

    it('handles SET_BASE_URL', function () {
      const action = {
        type: actions.SET_BASE_URL.type,
        payload: {
          url: 'it'
        }
      }
      const dispatch = a => assert.equal(a.payload.baseUrl, 'it')
      const env = {
        get: () => { return { name: 'any' } }
      }
      const state = reducer(null, action)
      assert.equal(typeof (state), 'function')
      state({ dispatch, env })
    })

    it('handles GET_INSTALLED', function (done) {
      const action = {
        type: actions.GET_INSTALLED.type
      }
      const installManager = {
        syncInstalled: done
      }

      const state = reducer(null, action)
      assert.equal(typeof (state), 'function')
      state({ installManager })
    })

    it('handles SELF_UNINSTALLED', function (done) {
      const action = {
        type: actions.SELF_UNINSTALLED.type
      }
      const self = { id: 1 }
      const installManager = {
        uninstallAll: done
      }
      const telemetry = {
        ping: (id, name) => assert.equal(name, 'disabled'),
        restorePrefs: () => {}
      }
      const state = reducer(null, action)
      state({self, installManager, telemetry})
    })

    it('handles MAYBE_NOTIFY', function () {
      const action = {
        type: actions.MAYBE_NOTIFY.type,
        payload: {
          experiment: {}
        }
      }
      const notificationManager = {
        maybeNotify: x => assert.equal(x, action.payload.experiment)
      }
      const state = reducer(null, action)
      state({notificationManager})
    })

    it('handles INSTALL_FAILED', function () {
      const action = {
        type: actions.INSTALL_FAILED.type
      }
      const state = reducer(null, action)
      assert.equal(state, nothing)
    })

    it('handles INSTALL_STARTED', function () {
      const action = {
        type: actions.INSTALL_STARTED.type
      }
      const state = reducer(null, action)
      assert.equal(state, nothing)
    })

    it('handles INSTALL_CANCELLED', function () {
      const action = {
        type: actions.INSTALL_CANCELLED.type
      }
      const state = reducer(null, action)
      assert.equal(state, nothing)
    })

    it('handles DOWNLOAD_STARTED', function () {
      const action = {
        type: actions.DOWNLOAD_STARTED.type
      }
      const state = reducer(null, action)
      assert.equal(state, nothing)
    })

    it('handles DOWNLOAD_PROGRESS', function () {
      const action = {
        type: actions.DOWNLOAD_PROGRESS.type
      }
      const state = reducer(null, action)
      assert.equal(state, nothing)
    })

    it('handles DOWNLOAD_ENDED', function () {
      const action = {
        type: actions.DOWNLOAD_ENDED.type
      }
      const state = reducer(null, action)
      assert.equal(state, nothing)
    })

    it('handles DOWNLOAD_CANCELLED', function () {
      const action = {
        type: actions.DOWNLOAD_CANCELLED.type
      }
      const state = reducer(null, action)
      assert.equal(state, nothing)
    })

    it('handles DOWNLOAD_FAILED', function () {
      const action = {
        type: actions.DOWNLOAD_FAILED.type
      }
      const state = reducer(null, action)
      assert.equal(state, nothing)
    })

    it('handles LOAD_EXPERIMENTS', function (done) {
      const action = {
        type: actions.LOAD_EXPERIMENTS.type,
        payload: {
          envname: 'test',
          baseUrl: 'baseUrl'
        }
      }
      const loader = {
        loadExperiments: () => done()
      }
      const state = reducer(null, action)
      state({loader})
    })

    it('handles INSTALL_STARTED', function () {
      const action = {
        type: actions.INSTALL_STARTED.type
      }
      const state = reducer(null, action)
      assert.equal(state, nothing)
    })

    it('handles LOADING_EXPERIMENTS', function () {
      const action = {
        type: actions.LOADING_EXPERIMENTS.type
      }
      const state = reducer(null, action)
      assert.equal(state, nothing)
    })

    it('handles EXPERIMENT_UNINSTALLED', function () {
      const action = {
        type: actions.EXPERIMENT_UNINSTALLED.type
      }
      const state = reducer(null, action)
      assert.equal(state, nothing)
    })

    it('handles SELF_ENABLED', function () {
      const action = {
        type: actions.SELF_ENABLED.type
      }
      const self = { id: 1 }
      const telemetry = {
        ping: (id, name) => {
          assert.equal(name, 'enabled')
        },
        setPrefs: () => {}
      }
      const state = reducer(null, action)
      state({self, telemetry})
    })

    it('handles SELF_DISABLED', function (done) {
      const action = {
        type: actions.SELF_DISABLED.type
      }
      const self = { id: 1 }
      const telemetry = {
        ping: (id, name) => {
          assert.equal(name, 'disabled')
        },
        restorePrefs: done
      }
      const state = reducer(null, action)
      state({self, telemetry})
    })

    it('handles SYNC_INSTALLED', function () {
      const action = {
        type: actions.SYNC_INSTALLED.type
      }
      const state = reducer(null, action)
      assert.equal(state, nothing)
    })

    it('handles CHANGE_ENV', function () {
      const action = {
        type: actions.CHANGE_ENV.type
      }
      const e = { name: 'production', baseUrl: 'foo' }
      const env = {
        get: () => e
      }
      const dispatch = sinon.spy()
      const webapp = {
        changeEnv: sinon.spy()
      }
      const state = reducer(null, action)
      state({env, dispatch, webapp})
      assert.ok(webapp.changeEnv.calledOnce)
      assert.ok(webapp.changeEnv.calledWith(e))
      assert.ok(dispatch.calledOnce)
      const a = dispatch.firstCall.args[0]
      assert.equal(a.type, actions.LOAD_EXPERIMENTS.type)
      assert.equal(a.payload.baseUrl, e.baseUrl)
    })

    it('handles SHOW_NOTIFICATION', function () {
      const action = {
        type: actions.SHOW_NOTIFICATION.type,
        payload: {}
      }
      const notificationManager = {
        showNotification: sinon.spy()
      }
      const state = reducer(null, action)
      state({notificationManager})
      assert.ok(notificationManager.showNotification.calledOnce)
      assert.ok(notificationManager.showNotification.calledWith(action.payload))
    })
  })

  describe('running side effects', function () {
    it('uses the set context', function () {
      let sub = null
      const effects = sinon.spy()
      const unsub = sinon.spy()
      const context = {}
      const store = {
        subscribe: fn => {
          sub = fn
          return unsub
        },
        getState: () => ({ sideEffects: effects })
      }
      sideEffects.setContext(context)
      sideEffects.enable(store)
      sub()
      assert.ok(effects.calledOnce)
      assert.ok(effects.calledWith(context))
      assert.ok(!unsub.called)
      sideEffects.disable()
      assert.ok(unsub.calledOnce)
    })
  })

  it('does nothing, literally', function () {
    assert.doesNotThrow(function () {
      sideEffects.nothing()
    })
  })
})
