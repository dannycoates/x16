import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { showExperiment } from '../../actions'
import environments from '../../../../common/environments'
import ExperimentList from '../../components/ExperimentList'

import './App.css'

class App extends Component {
  static propTypes = {
    env: PropTypes.string,
    experiments: ExperimentList.propTypes.experiments,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { env, experiments, dispatch } = this.props
    return (
      <div>
        <ExperimentList
          experiments={ experiments }
          onExperimentClick={ href => dispatch(showExperiment(href)) }
        />
        <a className="view-all" href="#" onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          dispatch(showExperiment(environments[env].baseUrl))
        }}>View all experiments</a>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    env: state.env,
    experiments: Object.keys(state.experiments).map(k => state.experiments[k])
  }
}

export default connect(
  mapStateToProps
)(App)
