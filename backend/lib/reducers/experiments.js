/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

import actions from '../../../common/actions'
import pickBy from 'lodash/pickBy'

export function reducer (experiments = {}, { payload, type }) {
  let x, n
  switch (type) {
    case actions.EXPERIMENTS_LOAD_ERROR.type:
      return {}

    case actions.EXPERIMENTS_LOADED.type:
      return Object.assign({}, payload.experiments)

    case actions.EXPERIMENT_ENABLED.type:
    case actions.INSTALL_ENDED.type:
      x = experiments[payload.experiment.addon_id]
      n = Object.assign({}, x, { active: true, installDate: payload.experiment.installDate })
      return Object.assign({}, experiments, { [n.addon_id]: n })

    case actions.EXPERIMENT_DISABLED.type:
    case actions.EXPERIMENT_UNINSTALLING.type:
      x = experiments[payload.experiment.addon_id]
      n = Object.assign({}, x, { active: false })
      return Object.assign({}, experiments, { [n.addon_id]: n })

    default:
      return experiments
  }
}

export function activeExperiments (state) {
  return pickBy(state.experiments, x => x.active)
}

export function randomActiveExperiment (state) {
  const installed = activeExperiments(state)
  const installedKeys = Object.keys(installed)
  const id = installedKeys[Math.floor(Math.random() * installedKeys.length)]
  return installed[id]
}
