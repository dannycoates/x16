/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('../common/actions')
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

const { reducer, nothing } = mockLoader.require('../backend/lib/reducers/sideEffects')

exports['test EXPERIMENTS_LOADED'] = (assert, done) => {
  const action = {
    type: actions.EXPERIMENTS_LOADED.type
  }
  const loader = {
    schedule: done
  }
  const state = reducer(null, action)
  state({loader})
}

exports['test INSTALL_ENDED'] = (assert) => {
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
  const add = mocks.channels.add.calls()
  assert.equal(add.length, 1, 'added channel')
  assert.equal(add[0][0], X.addon_id, 'passed correct id')
}

exports['test EXPERIMENTS_LOAD_ERROR'] = (assert) => {
  const action = {
    type: actions.EXPERIMENTS_LOAD_ERROR.type
  }
  const state = reducer(null, action)
  assert.equal(state, nothing)
}

exports['test EXPERIMENT_ENABLED'] = (assert) => {
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
  const add = mocks.channels.add.calls()
  assert.equal(add.length, 1, 'added channel')
  assert.equal(add[0][0], X.addon_id, 'passed correct id')
}

exports['test EXPERIMENT_DISABLED'] = (assert) => {
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
  const remove = mocks.channels.remove.calls()
  assert.equal(remove.length, 1, 'removed channel')
  assert.equal(remove[0][0], X.addon_id, 'passed correct id')
}

exports['test EXPERIMENT_UNINSTALLING'] = (assert) => {
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
  const remove = mocks.channels.remove.calls()
  assert.equal(remove.length, 1, 'removed channel')
  assert.equal(remove[0][0], X.addon_id, 'passed correct id')
}

exports['test SET_BADGE'] = (assert, done) => {
  const action = {
    type: actions.SET_BADGE.type
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
    type: actions.MAIN_BUTTON_CLICKED.type
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
    type: actions.SCHEDULE_NOTIFIER.type
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
    type: actions.SET_RATING.type
  }
  const state = reducer(null, action)
  assert.equal(state, nothing)
}

exports['test SHOW_RATING_PROMPT'] = (assert, done) => {
  const action = {
    type: actions.SHOW_RATING_PROMPT.type
  }
  const feedbackManager = {
    prompt: () => done()
  }
  const state = reducer(null, action)
  state({feedbackManager})
}

exports['test SHOW_EXPERIMENT'] = (assert) => {
  const action = {
    type: actions.SHOW_EXPERIMENT.type,
    payload: {
      url: 'foobar'
    }
  }
  const ui = {
    openTab: url => assert.equal(url, action.payload.url)
  }
  const state = reducer(null, action)
  assert.equal(typeof (state), 'function')
  state({ ui })
}

exports['test INSTALL_EXPERIMENT'] = (assert) => {
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
}

exports['test UNINSTALL_EXPERIMENT'] = (assert) => {
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
}

exports['test UNINSTALL_SELF'] = (assert, done) => {
  const action = {
    type: actions.UNINSTALL_SELF.type
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
    type: actions.SELF_INSTALLED.type,
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
    type: actions.SET_BASE_URL.type,
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
    type: actions.GET_INSTALLED.type
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
    type: actions.SELF_UNINSTALLED.type
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
}

exports['test INSTALL_FAILED'] = (assert) => {
  const action = {
    type: actions.INSTALL_FAILED.type
  }
  const state = reducer(null, action)
  assert.equal(state, nothing)
}

exports['test INSTALL_STARTED'] = (assert) => {
  const action = {
    type: actions.INSTALL_STARTED.type
  }
  const state = reducer(null, action)
  assert.equal(state, nothing)
}

exports['test INSTALL_CANCELLED'] = (assert) => {
  const action = {
    type: actions.INSTALL_CANCELLED.type
  }
  const state = reducer(null, action)
  assert.equal(state, nothing)
}

exports['test DOWNLOAD_STARTED'] = (assert) => {
  const action = {
    type: actions.DOWNLOAD_STARTED.type
  }
  const state = reducer(null, action)
  assert.equal(state, nothing)
}

exports['test DOWNLOAD_PROGRESS'] = (assert) => {
  const action = {
    type: actions.DOWNLOAD_PROGRESS.type
  }
  const state = reducer(null, action)
  assert.equal(state, nothing)
}

exports['test DOWNLOAD_ENDED'] = (assert) => {
  const action = {
    type: actions.DOWNLOAD_ENDED.type
  }
  const state = reducer(null, action)
  assert.equal(state, nothing)
}

exports['test DOWNLOAD_CANCELLED'] = (assert) => {
  const action = {
    type: actions.DOWNLOAD_CANCELLED.type
  }
  const state = reducer(null, action)
  assert.equal(state, nothing)
}

exports['test DOWNLOAD_FAILED'] = (assert) => {
  const action = {
    type: actions.DOWNLOAD_FAILED.type
  }
  const state = reducer(null, action)
  assert.equal(state, nothing)
}

exports['test LOAD_EXPERIMENTS'] = (assert) => {
  const action = {
    type: actions.LOAD_EXPERIMENTS.type
  }
  const state = reducer(null, action)
  assert.equal(state, nothing)
}

exports['test INSTALL_STARTED'] = (assert) => {
  const action = {
    type: actions.INSTALL_STARTED.type
  }
  const state = reducer(null, action)
  assert.equal(state, nothing)
}

exports['test LOADING_EXPERIMENTS'] = (assert) => {
  const action = {
    type: actions.LOADING_EXPERIMENTS.type
  }
  const state = reducer(null, action)
  assert.equal(state, nothing)
}

exports['test EXPERIMENT_UNINSTALLED'] = (assert) => {
  const action = {
    type: actions.EXPERIMENT_UNINSTALLED.type
  }
  const state = reducer(null, action)
  assert.equal(state, nothing)
}

exports['test SELF_ENABLED'] = (assert) => {
  const action = {
    type: actions.SELF_ENABLED.type
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
    type: actions.SELF_DISABLED.type
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
    type: actions.SYNC_INSTALLED.type
  }
  const state = reducer(null, action)
  assert.equal(state, nothing)
}

before(module.exports, function (name, assert, done) {
  MockUtils.resetCallbacks(mocks)
  done()
})

require('sdk/test').run(exports)
