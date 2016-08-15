import { combineReducers } from 'redux'

function experiments(state = [], action) {
  switch (action.type) {
    case 'UPDATE_EXPERIMENTS':
      let experiments = action.json.results
      return [...experiments]
    default:
      return state
  }
}

function env(state = 'production', action) {
  return state
}

const reducers = combineReducers({
  experiments,
  env
})

export default reducers
