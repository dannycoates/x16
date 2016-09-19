/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../../../common/actionTypes')
const pickBy = require('lodash/pickBy')

function experiments (experiments = null, { payload, type }) {
  let x, n
  switch (type) {
    case actionTypes.EXPERIMENTS_LOAD_ERROR:
      return {}

    case actionTypes.EXPERIMENTS_LOADED:
      return Object.assign({}, payload.experiments)

    case actionTypes.EXPERIMENT_ENABLED:
    case actionTypes.INSTALL_ENDED:
      x = experiments[payload.experiment.addon_id]
      n = Object.assign({}, x, { active: true, installDate: payload.experiment.installDate })
      return Object.assign({}, experiments, { [n.addon_id]: n })

    case actionTypes.EXPERIMENT_DISABLED:
    case actionTypes.EXPERIMENT_UNINSTALLING:
      x = experiments[payload.experiment.addon_id]
      n = Object.assign({}, x, { active: false })
      return Object.assign({}, experiments, { [n.addon_id]: n })

    default:
      return experiments
  }
}

function activeExperiments (state) {
  return pickBy(state.experiments, x => x.active)
}

function randomActiveExperiment (state) {
  const installed = activeExperiments(state)
  const installedKeys = Object.keys(installed)
  const id = installedKeys[Math.floor(Math.random() * installedKeys.length)]
  return installed[id]
}

module.exports = {
  experiments,
  activeExperiments,
  randomActiveExperiment
}
