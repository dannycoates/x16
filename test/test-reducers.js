/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actions = require('../common/actions')
const reducers = require('../backend/lib/reducers')
const redux = require('redux/dist/redux.min')

const DEFAULT_STATE = {
  env: null,
  baseUrl: null,
  clientUUID: 'XXXX',
  notifications: {
    lastNotified: 1471935600000,
    nextCheck: 1471935600000
  },
  ui: {
    panelHeight: 0
  },
  ratings: {},
  experiments: null,
  sideEffects: null
}

const X = {
  id: 1,
  addon_id: 'X'
}
const Y = {
  id: 2,
  addon_id: 'Y'
}

function testAction (assert, action, initialState, expectedState) {
  const store = redux.createStore(reducers, initialState)
  store.dispatch(action)
  let state = store.getState()
  // side effects are tested in test-sideeffects.js
  delete state.sideEffects
  delete expectedState.sideEffects
  assert.deepEqual(state, expectedState, `${action.type} matched`)
}

exports['test EXPERIMENTS_LOADED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = Object.assign({}, initialState, {
    baseUrl: 'testpilot.dev:8000',
    env: 'test',
    experiments: { X, Y },
    ui: {
      panelHeight: 2 * 80 + 53
    }
  })
  const action = {
    type: actions.EXPERIMENTS_LOADED.type,
    payload: {
      env: 'test',
      baseUrl: 'testpilot.dev:8000',
      experiments: { X, Y }
    }
  }
  testAction(assert, action, initialState, expectedState)
}

exports['test INSTALL_ENDED'] = (assert) => {
  const installDate = new Date()
  const initialState = Object.assign({}, DEFAULT_STATE, {
    experiments: { X, Y }
  })
  const expectedState = Object.assign({}, initialState, {
    experiments: {
      X: Object.assign({}, X, { active: true, installDate }),
      Y
    }
  })
  const action = {
    type: actions.INSTALL_ENDED.type,
    payload: {
      experiment: Object.assign({}, X, { installDate })
    }
  }
  testAction(assert, action, initialState, expectedState)
}

exports['test EXPERIMENTS_LOAD_ERROR'] = (assert) => {
  const initialState = Object.assign({}, DEFAULT_STATE, {
    experiments: { X, Y },
    ui: {
      panelHeight: 2 * 80 + 53
    }
  })
  const expectedState = Object.assign({}, DEFAULT_STATE, {
    experiments: {},
    ui: { panelHeight: 53 }
  })
  const action = {
    type: actions.EXPERIMENTS_LOAD_ERROR.type,
    payload: {
      err: {}
    }
  }
  testAction(assert, action, initialState, expectedState)
}

exports['test EXPERIMENT_ENABLED'] = (assert) => {
  const installDate = new Date()
  const initialState = Object.assign({}, DEFAULT_STATE, {
    experiments: { X, Y }
  })
  const expectedState = Object.assign({}, initialState, {
    experiments: {
      X: Object.assign({}, X, { active: true, installDate }),
      Y
    }
  })
  const action = {
    type: actions.EXPERIMENT_ENABLED.type,
    payload: {
      experiment: Object.assign({}, X, { installDate })
    }
  }
  testAction(assert, action, initialState, expectedState)
}

exports['test EXPERIMENT_DISABLED'] = (assert) => {
  const initialState = Object.assign({}, DEFAULT_STATE, {
    experiments: { X: Object.assign({}, X, { active: true }) }
  })
  const expectedState = Object.assign({}, initialState, {
    experiments: {
      X: Object.assign({}, X, { active: false })
    }
  })
  const action = {
    type: actions.EXPERIMENT_DISABLED.type,
    payload: {
      experiment: X
    }
  }
  testAction(assert, action, initialState, expectedState)
}

exports['test EXPERIMENT_UNINSTALLING'] = (assert) => {
  const initialState = Object.assign({}, DEFAULT_STATE, {
    experiments: { X: Object.assign({}, X, { active: true }) }
  })
  const expectedState = Object.assign({}, initialState, {
    experiments: {
      X: Object.assign({}, X, { active: false })
    }
  })
  const action = {
    type: actions.EXPERIMENT_UNINSTALLING.type,
    payload: {
      experiment: X
    }
  }
  testAction(assert, action, initialState, expectedState)
}

exports['test SET_BADGE'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = Object.assign({}, DEFAULT_STATE, {
    ui: Object.assign({}, DEFAULT_STATE.ui, { badge: 'Hey' })
  })
  const action = {
    type: actions.SET_BADGE.type,
    payload: {
      text: 'Hey'
    }
  }
  testAction(assert, action, initialState, expectedState)
}

exports['test MAIN_BUTTON_CLICKED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = Object.assign({}, DEFAULT_STATE, {
    ui: Object.assign({}, DEFAULT_STATE.ui, { badge: null, clicked: 1 })
  })
  const action = {
    type: actions.MAIN_BUTTON_CLICKED.type,
    payload: {
      time: 1
    }
  }
  testAction(assert, action, initialState, expectedState)
}

exports['test SCHEDULE_NOTIFIER'] = (assert) => {
  const now = Date.now()
  const initialState = DEFAULT_STATE
  const expectedState = Object.assign({}, DEFAULT_STATE, {
    notifications: {
      lastNotified: now,
      nextCheck: now + 1
    }
  })
  const action = {
    type: actions.SCHEDULE_NOTIFIER.type,
    payload: {
      lastNotified: now,
      nextCheck: now + 1
    }
  }
  testAction(assert, action, initialState, expectedState)
}

exports['test SET_RATING'] = (assert) => {
  const now = Date.now()
  const initialState = DEFAULT_STATE
  const expectedState = Object.assign({}, DEFAULT_STATE, {
    ratings: {
      lastRated: now,
      X: {
        rating: 5
      }
    }
  })
  const action = {
    type: actions.SET_RATING.type,
    payload: {
      time: now,
      rating: 5,
      experiment: X
    }
  }
  testAction(assert, action, initialState, expectedState)
}

exports['test SHOW_RATING_PROMPT'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = Object.assign({}, DEFAULT_STATE, {
    ratings: {
      X: {
        '2': true
      }
    }
  })
  const action = {
    type: actions.SHOW_RATING_PROMPT.type,
    payload: {
      interval: 2,
      experiment: X
    }
  }
  testAction(assert, action, initialState, expectedState)
}

exports['test SHOW_EXPERIMENT'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = initialState
  const action = {
    type: actions.SHOW_EXPERIMENT.type,
    payload: {}
  }

  testAction(assert, action, initialState, expectedState)
}

exports['test INSTALL_EXPERIMENT'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = initialState
  const action = {
    type: actions.INSTALL_EXPERIMENT.type,
    payload: {}
  }

  testAction(assert, action, initialState, expectedState)
}

exports['test UNINSTALL_EXPERIMENT'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = initialState
  const action = {
    type: actions.UNINSTALL_EXPERIMENT.type,
    payload: {}
  }

  testAction(assert, action, initialState, expectedState)
}

exports['test UNINSTALL_SELF'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = initialState
  const action = {
    type: actions.UNINSTALL_SELF.type,
    payload: {}
  }

  testAction(assert, action, initialState, expectedState)
}

exports['test SELF_INSTALLED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = initialState
  const action = {
    type: actions.SELF_INSTALLED.type,
    payload: {}
  }

  testAction(assert, action, initialState, expectedState)
}

exports['test SET_BASE_URL'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = initialState
  const action = {
    type: actions.SET_BASE_URL.type,
    payload: {}
  }

  testAction(assert, action, initialState, expectedState)
}

exports['test GET_INSTALLED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = initialState
  const action = {
    type: actions.GET_INSTALLED.type,
    payload: {}
  }

  testAction(assert, action, initialState, expectedState)
}

exports['test SELF_UNINSTALLED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actions.SELF_UNINSTALLED.type,
    payload: {
      install: {}
    }
  }
  // Not implemented, no change expected
  testAction(assert, action, initialState, initialState)
}

exports['test INSTALL_FAILED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actions.INSTALL_FAILED.type,
    payload: {
      install: {}
    }
  }
  // Not implemented, no change expected
  testAction(assert, action, initialState, initialState)
}

exports['test INSTALL_STARTED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actions.INSTALL_STARTED.type,
    payload: {
      install: {}
    }
  }
  // Not implemented, no change expected
  testAction(assert, action, initialState, initialState)
}

exports['test INSTALL_CANCELLED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actions.INSTALL_CANCELLED.type,
    payload: {
      install: {}
    }
  }
  // Not implemented, no change expected
  testAction(assert, action, initialState, initialState)
}

exports['test DOWNLOAD_STARTED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actions.DOWNLOAD_STARTED.type,
    payload: {
      install: {}
    }
  }
  // Not implemented, no change expected
  testAction(assert, action, initialState, initialState)
}

exports['test DOWNLOAD_PROGRESS'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actions.DOWNLOAD_PROGRESS.type,
    payload: {
      install: {}
    }
  }
  // Not implemented, no change expected
  testAction(assert, action, initialState, initialState)
}

exports['test DOWNLOAD_ENDED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actions.DOWNLOAD_ENDED.type,
    payload: {
      install: {}
    }
  }
  // Not implemented, no change expected
  testAction(assert, action, initialState, initialState)
}

exports['test DOWNLOAD_CANCELLED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actions.DOWNLOAD_CANCELLED.type,
    payload: {
      install: {}
    }
  }
  // Not implemented, no change expected
  testAction(assert, action, initialState, initialState)
}

exports['test DOWNLOAD_FAILED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actions.DOWNLOAD_FAILED.type,
    payload: {
      install: {}
    }
  }
  // Not implemented, no change expected
  testAction(assert, action, initialState, initialState)
}

exports['test LOAD_EXPERIMENTS'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actions.LOAD_EXPERIMENTS.type,
    payload: {}
  }
  // no change expected
  testAction(assert, action, initialState, initialState)
}

exports['test INSTALL_STARTED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actions.INSTALL_STARTED.type,
    payload: {
      install: {}
    }
  }
  // Not implemented, no change expected
  testAction(assert, action, initialState, initialState)
}

exports['test LOADING_EXPERIMENTS'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actions.LOADING_EXPERIMENTS.type,
    payload: {
      install: {}
    }
  }
  // Not implemented, no change expected
  testAction(assert, action, initialState, initialState)
}

exports['test EXPERIMENT_UNINSTALLED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actions.EXPERIMENT_UNINSTALLED.type,
    payload: {
      experiment: {}
    }
  }
  // Not implemented, no change expected
  testAction(assert, action, initialState, initialState)
}

exports['test SELF_ENABLED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actions.SELF_ENABLED.type,
    payload: {}
  }
  // Not implemented, no change expected
  testAction(assert, action, initialState, initialState)
}

exports['test SELF_DISABLED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actions.SELF_DISABLED.type,
    payload: {}
  }
  // Not implemented, no change expected
  testAction(assert, action, initialState, initialState)
}

exports['test SYNC_INSTALLED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actions.SYNC_INSTALLED.type,
    payload: {}
  }
  // Not implemented, no change expected
  testAction(assert, action, initialState, initialState)
}

require('sdk/test').run(exports)
