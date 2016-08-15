import React, { Component, PropTypes } from 'react'
import Experiment from './Experiment'

export default class ExperimentList extends Component {
  render() {
    const { experiments, onExperimentClick } = this.props
    return (
      <div className="experiment-list">
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

ExperimentList.propTypes = {
  experiments: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    html_url: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    modified: PropTypes.string.isRequired,
    gradient_start: PropTypes.string.isRequired,
    gradient_stop: PropTypes.string.isRequired
  })).isRequired,
  onExperimentClick: PropTypes.func.isRequired
}
