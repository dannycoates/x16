/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../common/actionTypes')
const { before } = require('sdk/test/utils')
const MockUtils = require('./lib/mock-utils')

const mocks = MockUtils.callbacks({
  actions: [
    'installExperiment',
    'uninstallExperiment',
    'uninstallSelf',
    'loadExperiments',
    'syncInstalled'
  ]
})

const mockLoader = MockUtils.loader(module, './backend/lib/reducers/sideEffects.js', {
  './backend/lib/actions/index.js': mocks.actions
})

const reducer = mockLoader.require('../backend/lib/reducers/sideEffects')

exports['test EXPERIMENTS_LOADED'] = (assert) => {
  const action = {
    type: actionTypes.EXPERIMENTS_LOADED
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test INSTALL_ENDED'] = (assert) => {
  const action = {
    type: actionTypes.INSTALL_ENDED
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test EXPERIMENTS_LOAD_ERROR'] = (assert) => {
  const action = {
    type: actionTypes.EXPERIMENTS_LOAD_ERROR
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test EXPERIMENT_ENABLED'] = (assert) => {
  const action = {
    type: actionTypes.EXPERIMENT_ENABLED
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test EXPERIMENT_DISABLED'] = (assert) => {
  const action = {
    type: actionTypes.EXPERIMENT_DISABLED
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test EXPERIMENT_UNINSTALLING'] = (assert) => {
  const action = {
    type: actionTypes.EXPERIMENT_UNINSTALLING
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test SET_BADGE'] = (assert, done) => {
  const action = {
    type: actionTypes.SET_BADGE
  }
  const ui = {
    setBadge: done
  }
  const state = reducer(null, action)
  assert.equal(typeof (state), 'function')
  state({ ui })
}

exports['test MAIN_BUTTON_CLICKED'] = (assert, done) => {
  const action = {
    type: actionTypes.MAIN_BUTTON_CLICKED
  }
  const ui = {
    setBadge: done
  }
  const state = reducer(null, action)
  assert.equal(typeof (state), 'function')
  state({ ui })
}

exports['test MAYBE_NOTIFY'] = (assert, done) => {
  const action = {
    type: actionTypes.MAYBE_NOTIFY
  }
  const notificationManager = {
    schedule: done
  }
  const state = reducer(null, action)
  assert.equal(typeof (state), 'function')
  state({ dispatch: null, getState: null, notificationManager })
}

exports['test SET_RATING'] = (assert) => {
  const action = {
    type: actionTypes.SET_RATING
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test SHOW_RATING_PROMPT'] = (assert) => {
  const action = {
    type: actionTypes.SHOW_RATING_PROMPT
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test SHOW_EXPERIMENT'] = (assert) => {
  const action = {
    type: actionTypes.SHOW_EXPERIMENT,
    payload: {
      href: 'foobar'
    }
  }
  const ui = {
    openTab: href => assert.equal(href, action.payload.href)
  }
  const state = reducer(null, action)
  assert.equal(typeof (state), 'function')
  state({ ui })
}

exports['test INSTALL_EXPERIMENT'] = (assert) => {
  const action = {
    type: actionTypes.INSTALL_EXPERIMENT,
    payload: {
      experiment: {}
    }
  }
  const dispatch = () => {}
  const state = reducer(null, action)
  assert.equal(typeof (state), 'function')
  state({ dispatch })
  const calls = mocks.actions.installExperiment.calls()
  assert.equal(calls.length, 1, 'installExperiment called')
  assert.equal(calls[0][0], action.payload.experiment)
}

exports['test UNINSTALL_EXPERIMENT'] = (assert) => {
  const action = {
    type: actionTypes.UNINSTALL_EXPERIMENT,
    payload: {
      experiment: {}
    }
  }
  const dispatch = () => {}
  const state = reducer(null, action)
  assert.equal(typeof (state), 'function')
  state({ dispatch })
  const calls = mocks.actions.uninstallExperiment.calls()
  assert.equal(calls.length, 1, 'uninstallExperiment called')
  assert.equal(calls[0][0], action.payload.experiment)
}

exports['test UNINSTALL_SELF'] = (assert) => {
  const action = {
    type: actionTypes.UNINSTALL_SELF
  }
  const dispatch = () => {}
  const state = reducer(null, action)
  assert.equal(typeof (state), 'function')
  state({ dispatch })
  const calls = mocks.actions.uninstallSelf.calls()
  assert.equal(calls.length, 1, 'uninstallSelf called')
}

exports['test SELF_INSTALLED'] = (assert) => {
  const action = {
    type: actionTypes.SELF_INSTALLED,
    payload: {
      url: 'it'
    }
  }
  const tabs = {
    open: x => assert.equal(x.url, action.payload.url)
  }
  const state = reducer(null, action)
  assert.equal(typeof (state), 'function')
  state({ tabs })
}

exports['test SET_BASE_URL'] = (assert) => {
  const action = {
    type: actionTypes.SET_BASE_URL,
    payload: {
      url: 'it'
    }
  }
  const dispatch = () => {}
  const env = {
    get: () => { return { name: 'any' } }
  }
  const state = reducer(null, action)
  assert.equal(typeof (state), 'function')
  state({ dispatch, env })
  const calls = mocks.actions.loadExperiments.calls()
  assert.equal(calls.length, 1, 'loadExperiments called')
  assert.equal(calls[0][0], 'any')
  assert.equal(calls[0][1], action.payload.url)
}

exports['test GET_INSTALLED'] = (assert) => {
  const action = {
    type: actionTypes.GET_INSTALLED
  }
  const dispatch = () => {}
  const getState = () => { return { clientUUID: 'XX', experiments: {} } }
  const state = reducer(null, action)
  assert.equal(typeof (state), 'function')
  state({ dispatch, getState })
  const calls = mocks.actions.syncInstalled.calls()
  assert.equal(calls.length, 1, 'syncInstalled called')
}

exports['test SELF_UNINSTALLED'] = (assert) => {
  const action = {
    type: actionTypes.SELF_UNINSTALLED
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test INSTALL_FAILED'] = (assert) => {
  const action = {
    type: actionTypes.INSTALL_FAILED
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test INSTALL_STARTED'] = (assert) => {
  const action = {
    type: actionTypes.INSTALL_STARTED
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test INSTALL_CANCELLED'] = (assert) => {
  const action = {
    type: actionTypes.INSTALL_CANCELLED
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test DOWNLOAD_STARTED'] = (assert) => {
  const action = {
    type: actionTypes.DOWNLOAD_STARTED
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test DOWNLOAD_PROGRESS'] = (assert) => {
  const action = {
    type: actionTypes.DOWNLOAD_PROGRESS
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test DOWNLOAD_ENDED'] = (assert) => {
  const action = {
    type: actionTypes.DOWNLOAD_ENDED
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test DOWNLOAD_CANCELLED'] = (assert) => {
  const action = {
    type: actionTypes.DOWNLOAD_CANCELLED
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test DOWNLOAD_FAILED'] = (assert) => {
  const action = {
    type: actionTypes.DOWNLOAD_FAILED
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test LOAD_EXPERIMENTS'] = (assert) => {
  const action = {
    type: actionTypes.LOAD_EXPERIMENTS
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test INSTALL_STARTED'] = (assert) => {
  const action = {
    type: actionTypes.INSTALL_STARTED
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test LOADING_EXPERIMENTS'] = (assert) => {
  const action = {
    type: actionTypes.LOADING_EXPERIMENTS
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test EXPERIMENT_UNINSTALLED'] = (assert) => {
  const action = {
    type: actionTypes.EXPERIMENT_UNINSTALLED
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test SELF_ENABLED'] = (assert) => {
  const action = {
    type: actionTypes.SELF_ENABLED
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test SELF_DISABLED'] = (assert) => {
  const action = {
    type: actionTypes.SELF_DISABLED
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test SYNC_INSTALLED'] = (assert) => {
  const action = {
    type: actionTypes.SYNC_INSTALLED
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

before(module.exports, function (name, assert, done) {
  MockUtils.resetCallbacks(mocks)
  done()
})

require('sdk/test').run(exports)
