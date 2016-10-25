/* global describe it */
import assert from 'assert'
import { createStore } from 'redux'
import * as actions from '../../common/actions'
import reducers from '../lib/reducers'

const testState = {
  baseUrl: 'b',
  env: 'test',
  experiments: {
    a: { addon_id: 'a' },
    b: { addon_id: 'b' }
  }
}

describe('reducers', function () {
  it('initializes the state', function () {
    const store = createStore(reducers)
    assert.deepEqual(
      store.getState(),
      {
        baseUrl: null,
        env: null,
        experiments: {}
      }
    )
  })

  it('resets experiments on EXPERIMENTS_LOAD_ERROR', function () {
    const initialState = testState
    const store = createStore(reducers, initialState)
    store.dispatch(actions.EXPERIMENTS_LOAD_ERROR({err: null}))
    assert.deepEqual(store.getState(), {...initialState, experiments: {}})
  })

  it('sets experiments on EXPERIMENTS_LOADED', function () {
    const initialState = testState
    const store = createStore(reducers, initialState)
    store.dispatch(actions.EXPERIMENTS_LOADED({
      baseUrl: 'x',
      envname: 't',
      experiments: { x: {}, y: {} }
    }))
    assert.deepEqual(store.getState(), {
      baseUrl: 'x',
      env: 't',
      experiments: { x: {}, y: {} }
    })
  })

  it('enables an experiment on EXPERIMENT_ENABLED', function () {
    const initialState = testState
    const store = createStore(reducers, initialState)
    store.dispatch(actions.EXPERIMENT_ENABLED({
      experiment: { addon_id: 'a', installDate: '2016-01-31' }
    }))
    assert.deepEqual(store.getState(), {
      ...initialState,
      experiments: {
        a: { addon_id: 'a', active: true, install: null, installDate: '2016-01-31' },
        b: { addon_id: 'b' }
      }
    })
  })

  it('enables an experiment on INSTALL_ENDED', function () {
    const initialState = testState
    const store = createStore(reducers, initialState)
    store.dispatch(actions.INSTALL_ENDED({
      experiment: { addon_id: 'a', installDate: '2016-01-31' }
    }))
    assert.deepEqual(store.getState(), {
      ...initialState,
      experiments: {
        a: { addon_id: 'a', active: true, install: null, installDate: '2016-01-31' },
        b: { addon_id: 'b' }
      }
    })
  })

  it('disables an experiment on EXPERIMENT_DISABLED', function () {
    const initialState = testState
    const store = createStore(reducers, initialState)
    store.dispatch(actions.EXPERIMENT_DISABLED({
      experiment: { addon_id: 'a', installDate: '2016-01-31' }
    }))
    assert.deepEqual(store.getState(), {
      ...initialState,
      experiments: {
        a: { addon_id: 'a', active: false, installDate: '2016-01-31' },
        b: { addon_id: 'b' }
      }
    })
  })

  it('disables an experiment on EXPERIMENT_UNINSTALLING', function () {
    const initialState = testState
    const store = createStore(reducers, initialState)
    store.dispatch(actions.EXPERIMENT_UNINSTALLING({
      experiment: { addon_id: 'a' }
    }))
    assert.deepEqual(store.getState(), {
      ...initialState,
      experiments: {
        a: { addon_id: 'a', active: false, installDate: null },
        b: { addon_id: 'b' }
      }
    })
  })

  it('sets the install state on download', function () {
    const initialState = testState
    const store = createStore(reducers, initialState)
    store.dispatch(actions.INSTALL_STARTED({
      install: { addon_id: 'a', progress: 0, maxProgress: 10 }
    }))
    assert.deepEqual(store.getState(), {
      ...initialState,
      experiments: {
        a: { addon_id: 'a', install: { addon_id: 'a', progress: 0, maxProgress: 10 } },
        b: { addon_id: 'b' }
      }
    })
  })

  it('resets install state on failure', function () {
    const initialState = testState
    const store = createStore(reducers, initialState)
    store.dispatch(actions.INSTALL_FAILED({
      install: { addon_id: 'a' }
    }))
    assert.deepEqual(store.getState(), {
      ...initialState,
      experiments: {
        a: { addon_id: 'a', install: null },
        b: { addon_id: 'b' }
      }
    })
  })
})
