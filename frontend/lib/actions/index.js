import actionTypes from '../../../common/actionTypes'

export function showExperiment(href) {
  return {
    type: actionTypes.SHOW_EXPERIMENT,
    href
  }
}
