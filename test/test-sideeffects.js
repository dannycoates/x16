/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../common/actionTypes')
const { before } = require('sdk/test/utils')
const MockUtils = require('./lib/mock-utils')

const X = {
  id: 1,
  addon_id: 'X'
}

const mocks = MockUtils.callbacks({
  channels: ['add', 'remove'],
  tabs: ['open']
})

const mockLoader = MockUtils.loader(module, './backend/lib/reducers/sideEffects.js', {
  './backend/lib/metrics/webextension-channels.js': mocks.channels,
  'sdk/tabs': mocks.tabs
})

const reducer = mockLoader.require('../backend/lib/reducers/sideEffects')

exports['test EXPERIMENTS_LOADED'] = (assert, done) => {
  const action = {
    type: actionTypes.EXPERIMENTS_LOADED
  }
  const loader = {
    schedule: done
  }
  const state = reducer(null, action)
  state({loader})
}

exports['test INSTALL_ENDED'] = (assert) => {
  const action = {
    type: actionTypes.INSTALL_ENDED,
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
  const add = mocks.channels.add.calls()
  assert.equal(add.length, 1, 'added channel')
  assert.equal(add[0][0], X.addon_id, 'passed correct id')
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
    type: actionTypes.EXPERIMENT_ENABLED,
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
  const add = mocks.channels.add.calls()
  assert.equal(add.length, 1, 'added channel')
  assert.equal(add[0][0], X.addon_id, 'passed correct id')
}

exports['test EXPERIMENT_DISABLED'] = (assert) => {
  const action = {
    type: actionTypes.EXPERIMENT_DISABLED,
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
  const remove = mocks.channels.remove.calls()
  assert.equal(remove.length, 1, 'removed channel')
  assert.equal(remove[0][0], X.addon_id, 'passed correct id')
}

exports['test EXPERIMENT_UNINSTALLING'] = (assert) => {
  const action = {
    type: actionTypes.EXPERIMENT_UNINSTALLING,
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
  const remove = mocks.channels.remove.calls()
  assert.equal(remove.length, 1, 'removed channel')
  assert.equal(remove[0][0], X.addon_id, 'passed correct id')
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

exports['test MAIN_BUTTON_CLICKED'] = (assert) => {
  const action = {
    type: actionTypes.MAIN_BUTTON_CLICKED
  }
  const ui = {
    setBadge: () => {}
  }
  const telemetry = {
    ping: (id, name) => {
      assert.equal(id, 'txp_toolbar_menu_1')
      assert.equal(name, 'clicked')
    }
  }
  const state = reducer(null, action)
  assert.equal(typeof (state), 'function')
  state({ ui, telemetry })
}

exports['test SCHEDULE_NOTIFIER'] = (assert, done) => {
  const action = {
    type: actionTypes.SCHEDULE_NOTIFIER
  }
  const notificationManager = {
    schedule: done
  }
  const state = reducer(null, action)
  assert.equal(typeof (state), 'function')
  state({ notificationManager })
}

exports['test SET_RATING'] = (assert) => {
  const action = {
    type: actionTypes.SET_RATING
  }
  const state = reducer(null, action)
  assert.equal(state, null)
}

exports['test SHOW_RATING_PROMPT'] = (assert, done) => {
  const action = {
    type: actionTypes.SHOW_RATING_PROMPT
  }
  const feedbackManager = {
    prompt: () => done()
  }
  const state = reducer(null, action)
  state({feedbackManager})
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
  const installManager = {
    installExperiment: (x) => assert.equal(x, action.payload.experiment)
  }
  const state = reducer(null, action)
  assert.equal(typeof (state), 'function')
  state({ installManager })
}

exports['test UNINSTALL_EXPERIMENT'] = (assert) => {
  const action = {
    type: actionTypes.UNINSTALL_EXPERIMENT,
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
}

exports['test UNINSTALL_SELF'] = (assert, done) => {
  const action = {
    type: actionTypes.UNINSTALL_SELF
  }
  const installManager = {
    uninstallSelf: done
  }
  const state = reducer(null, action)
  assert.equal(typeof (state), 'function')
  state({ installManager })
}

exports['test SELF_INSTALLED'] = (assert) => {
  const action = {
    type: actionTypes.SELF_INSTALLED,
    payload: {
      url: 'it'
    }
  }
  const telemetry = {
    ping: (id, name) => {
      assert.equal(name, 'enabled')
    }
  }
  const state = reducer(null, action)
  assert.equal(typeof (state), 'function')
  state({telemetry})
  const open = mocks.tabs.open.calls()
  assert.equal(open.length, 1)
}

exports['test SET_BASE_URL'] = (assert) => {
  const action = {
    type: actionTypes.SET_BASE_URL,
    payload: {
      url: 'it'
    }
  }
  const loader = {
    loadExperiments: (n, url) => {
      assert.equal(n, 'any')
      assert.equal(url, action.payload.url)
    }
  }
  const env = {
    get: () => { return { name: 'any' } }
  }
  const state = reducer(null, action)
  assert.equal(typeof (state), 'function')
  state({ loader, env })
}

exports['test GET_INSTALLED'] = (assert, done) => {
  const action = {
    type: actionTypes.GET_INSTALLED
  }
  const installManager = {
    syncInstalled: done
  }

  const state = reducer(null, action)
  assert.equal(typeof (state), 'function')
  state({ installManager })
}

exports['test SELF_UNINSTALLED'] = (assert, done) => {
  const action = {
    type: actionTypes.SELF_UNINSTALLED
  }
  const installManager = {
    uninstallAll: done
  }
  const telemetry = {
    ping: (id, name) => assert.equal(name, 'disabled')
  }
  const state = reducer(null, action)
  state({installManager, telemetry})
}

exports['test MAYBE_NOTIFY'] = (assert) => {
  const action = {
    type: actionTypes.MAYBE_NOTIFY,
    payload: {
      experiment: {}
    }
  }
  const notificationManager = {
    maybeNotify: x => assert.equal(x, action.payload.experiment)
  }
  const state = reducer(null, action)
  state({notificationManager})
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
  const telemetry = {
    ping: (id, name) => {
      assert.equal(name, 'enabled')
    }
  }
  const state = reducer(null, action)
  state({telemetry})
}

exports['test SELF_DISABLED'] = (assert) => {
  const action = {
    type: actionTypes.SELF_DISABLED
  }
  const telemetry = {
    ping: (id, name) => {
      assert.equal(name, 'disabled')
    }
  }
  const state = reducer(null, action)
  state({telemetry})
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
