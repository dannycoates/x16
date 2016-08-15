import backend from '../backend'

export function showExperiment(href) {
  const action = {
    type: 'SHOW_EXPERIMENT',
    href
  }
  backend.send(action)
  return action
}

export function changePanelHeight(height) {
  const action = {
    type: 'CHANGE_PANEL_HEIGHT',
    height
  }
  backend.send(action)
  return action
}

function loadExperiments(env) {
  const action = {
    type: 'LOAD_EXPERIMENTS',
    env
  }
  backend.send(action)
  return action
}

function shouldLoadExperiments(state, env) {
  return true // TODO
}

export function loadExperimentsIfNeeded(env) {
  return (dispatch, getState) => {
    if (shouldLoadExperiments(getState(), env)) {
      return dispatch(loadExperiments(env))
    }
  }
}
