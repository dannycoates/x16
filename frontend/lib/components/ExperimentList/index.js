/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import React, { Component } from 'react'
import Experiment from '../Experiment'

import './ExperimentList.css'

// eslint-disable-next-line
import type { ExperimentProps } from '../Experiment'

export type ExperimentListProps = {
  experiments: Array<ExperimentProps>,
  onExperimentClick: (url: string) => void
}

export default class ExperimentList extends Component {
  props: ExperimentListProps

  render () {
    const { experiments, onExperimentClick } = this.props
    return (
      <div className='experiment-list'>
        {experiments.map(experiment =>
          <Experiment
            key={experiment.addon_id}
            {...experiment}
            onClick={onExperimentClick}
          />
        )}
      </div>
    )
  }
}
