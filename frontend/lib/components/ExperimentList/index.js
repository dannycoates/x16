/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

import React, { Component, PropTypes } from 'react'
import Experiment from '../Experiment'

import './ExperimentList.css'

export default class ExperimentList extends Component {
  static propTypes = {
    experiments: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
      html_url: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired,
      created: PropTypes.string.isRequired,
      modified: PropTypes.string.isRequired,
      gradient_start: PropTypes.string.isRequired,
      gradient_stop: PropTypes.string.isRequired
    })).isRequired,
    onExperimentClick: PropTypes.func.isRequired
  }

  render () {
    const { experiments, onExperimentClick } = this.props
    return (
      <div className='experiment-list'>
        {experiments.map(experiment =>
          <Experiment
            key={experiment.id}
            {...experiment}
            onClick={() => onExperimentClick(experiment.html_url)}
          />
        )}
      </div>
    )
  }
}
