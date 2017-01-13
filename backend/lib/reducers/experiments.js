/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import * as actions from '../../../common/actions'
import pickBy from 'lodash/pickBy'
import { Experiment } from '../../../common/Experiment'

// eslint-disable-next-line
import type { Experiments } from '../../../common/Experiment'
import type { Action, BackendState } from 'testpilot/types'

export function reducer (experiments: Experiments = {}, { payload, type }: Action): Experiments {
  let x, n
  switch (type) {
    case actions.EXPERIMENTS_LOAD_ERROR.type:
      return {}

    case actions.EXPERIMENTS_LOADED.type:
      return Object.assign({}, payload.experiments)

    case actions.EXPERIMENT_ENABLED.type:
    case actions.INSTALL_ENDED.type:
      x = experiments[payload.experiment.addon_id]
      n = new Experiment(Object.assign({}, x, { active: true, installDate: payload.experiment.installDate }))
      return Object.assign({}, experiments, { [n.addon_id]: n })

    case actions.EXPERIMENT_DISABLED.type:
    case actions.EXPERIMENT_UNINSTALLING.type:
      x = experiments[payload.experiment.addon_id]
      n = new Experiment(Object.assign({}, x, { active: false }))
      return Object.assign({}, experiments, { [n.addon_id]: n })
  }
  return experiments
}

export function activeExperiments (state: BackendState): Experiments {
  return pickBy(state.experiments, x => x.active)
}

// TODO: some kind of selector lib to replace this maybe?
export function activeCompletedExperimentList (state: BackendState): Array<Experiment> {
  const active = activeExperiments(state)
  const ids = Object.keys(active)
  return ids
    .map(id => active[id])
    .filter(x => x.completed && new Date(x.completed) < new Date())
}

export function randomActiveExperiment (state: BackendState): Experiment {
  const installed = activeExperiments(state)
  const installedKeys = Object.keys(installed)
  const id = installedKeys[Math.floor(Math.random() * installedKeys.length)]
  return installed[id]
}
