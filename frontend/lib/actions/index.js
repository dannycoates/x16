import actionTypes from '../../../common/actionTypes'

export function showExperiment(href) {
  return {
    type: actionTypes.SHOW_EXPERIMENT,
    href
  }
}

export function changePanelHeight(height) {
  return {
    type: actionTypes.CHANGE_PANEL_HEIGHT,
    height
  }
}

function getExperiments(env) {
  return {
    type: actionTypes.GET_EXPERIMENTS,
    env
  }
}

function shouldLoadExperiments(state, env) {
  return state.env !== env
}

export function loadExperimentsIfNeeded(env) {
  return (dispatch, getState) => {
    if (shouldLoadExperiments(getState(), env)) {
      return dispatch(getExperiments(env))
    }
  }
}
