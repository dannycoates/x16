/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../common/actionTypes')
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
  if (expectedState.sideEffects) {
    assert.equal(typeof (state.sideEffects), 'function', `${action.type} has sideEffects`)
  }
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
    type: actionTypes.EXPERIMENTS_LOADED,
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
    type: actionTypes.INSTALL_ENDED,
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
    type: actionTypes.EXPERIMENTS_LOAD_ERROR,
    payload: {
      res: {}
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
    type: actionTypes.EXPERIMENT_ENABLED,
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
    type: actionTypes.EXPERIMENT_DISABLED,
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
    type: actionTypes.EXPERIMENT_UNINSTALLING,
    payload: {
      experiment: X
    }
  }
  testAction(assert, action, initialState, expectedState)
}

exports['test SET_BADGE'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = Object.assign({}, DEFAULT_STATE, {
    ui: Object.assign({}, DEFAULT_STATE.ui, { badge: 'Hey' }),
    sideEffects: true
  })
  const action = {
    type: actionTypes.SET_BADGE,
    payload: {
      text: 'Hey'
    }
  }
  testAction(assert, action, initialState, expectedState)
}

exports['test MAIN_BUTTON_CLICKED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = Object.assign({}, DEFAULT_STATE, {
    ui: Object.assign({}, DEFAULT_STATE.ui, { badge: null, clicked: 1 }),
    sideEffects: true
  })
  const action = {
    type: actionTypes.MAIN_BUTTON_CLICKED,
    payload: {
      time: 1
    }
  }
  testAction(assert, action, initialState, expectedState)
}

exports['test MAYBE_NOTIFY'] = (assert) => {
  const now = Date.now()
  const initialState = DEFAULT_STATE
  const expectedState = Object.assign({}, DEFAULT_STATE, {
    notifications: {
      lastNotified: now,
      nextCheck: now + 1
    },
    sideEffects: true
  })
  const action = {
    type: actionTypes.MAYBE_NOTIFY,
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
    type: actionTypes.SET_RATING,
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
    type: actionTypes.SHOW_RATING_PROMPT,
    payload: {
      interval: 2,
      experiment: X
    }
  }
  testAction(assert, action, initialState, expectedState)
}

exports['test SHOW_EXPERIMENT'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = Object.assign({}, DEFAULT_STATE, {
    sideEffects: true
  })
  const action = {
    type: actionTypes.SHOW_EXPERIMENT,
    payload: {}
  }

  testAction(assert, action, initialState, expectedState)
}

exports['test INSTALL_EXPERIMENT'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = Object.assign({}, DEFAULT_STATE, {
    sideEffects: true
  })
  const action = {
    type: actionTypes.INSTALL_EXPERIMENT,
    payload: {}
  }

  testAction(assert, action, initialState, expectedState)
}

exports['test UNINSTALL_EXPERIMENT'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = Object.assign({}, DEFAULT_STATE, {
    sideEffects: true
  })
  const action = {
    type: actionTypes.UNINSTALL_EXPERIMENT,
    payload: {}
  }

  testAction(assert, action, initialState, expectedState)
}

exports['test UNINSTALL_SELF'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = Object.assign({}, DEFAULT_STATE, {
    sideEffects: true
  })
  const action = {
    type: actionTypes.UNINSTALL_SELF,
    payload: {}
  }

  testAction(assert, action, initialState, expectedState)
}

exports['test SELF_INSTALLED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = Object.assign({}, DEFAULT_STATE, {
    sideEffects: true
  })
  const action = {
    type: actionTypes.SELF_INSTALLED,
    payload: {}
  }

  testAction(assert, action, initialState, expectedState)
}

exports['test SET_BASE_URL'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = Object.assign({}, DEFAULT_STATE, {
    sideEffects: true
  })
  const action = {
    type: actionTypes.SET_BASE_URL,
    payload: {}
  }

  testAction(assert, action, initialState, expectedState)
}

exports['test GET_INSTALLED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const expectedState = Object.assign({}, DEFAULT_STATE, {
    sideEffects: true
  })
  const action = {
    type: actionTypes.GET_INSTALLED,
    payload: {}
  }

  testAction(assert, action, initialState, expectedState)
}

exports['test SELF_UNINSTALLED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actionTypes.SELF_UNINSTALLED,
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
    type: actionTypes.INSTALL_FAILED,
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
    type: actionTypes.INSTALL_STARTED,
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
    type: actionTypes.INSTALL_CANCELLED,
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
    type: actionTypes.DOWNLOAD_STARTED,
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
    type: actionTypes.DOWNLOAD_PROGRESS,
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
    type: actionTypes.DOWNLOAD_ENDED,
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
    type: actionTypes.DOWNLOAD_CANCELLED,
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
    type: actionTypes.DOWNLOAD_FAILED,
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
    type: actionTypes.LOAD_EXPERIMENTS,
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
    type: actionTypes.INSTALL_STARTED,
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
    type: actionTypes.LOADING_EXPERIMENTS,
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
    type: actionTypes.EXPERIMENT_UNINSTALLED,
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
    type: actionTypes.SELF_ENABLED,
    payload: {}
  }
  // Not implemented, no change expected
  testAction(assert, action, initialState, initialState)
}

exports['test SELF_DISABLED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actionTypes.SELF_DISABLED,
    payload: {}
  }
  // Not implemented, no change expected
  testAction(assert, action, initialState, initialState)
}

exports['test SYNC_INSTALLED'] = (assert) => {
  const initialState = DEFAULT_STATE
  const action = {
    type: actionTypes.SYNC_INSTALLED,
    payload: {}
  }
  // Not implemented, no change expected
  testAction(assert, action, initialState, initialState)
}

require('sdk/test').run(exports)
