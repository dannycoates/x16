import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  showExperiment,
  loadExperimentsIfNeeded,
  changePanelHeight
} from '../actions'
import ExperimentList from '../components/ExperimentList'

class AsyncApp extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { dispatch, env } = this.props
    dispatch(loadExperimentsIfNeeded(env || 'production'))
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.env !== this.props.env) {
    //   const { dispatch } = this.props
    //   dispatch(loadExperimentsIfNeeded(nextProps.env))
    // }
  }

  componentDidUpdate() {
    // const height = document.body.clientHeight
    // this.props.dispatch(changePanelHeight(height))
  }

  render() {
    const { experiments, dispatch } = this.props
    return (
      <div>
        <ExperimentList
          experiments={ experiments }
          onExperimentClick={ href => dispatch(showExperiment(href)) }
        />
        <a className="view-all" href="#" onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          dispatch(showExperiment('TODO'))
        }}>View all experiments</a>
      </div>
    )
  }
}

AsyncApp.propTypes = {
  env: PropTypes.string,
  experiments: ExperimentList.propTypes.experiments,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    env: state.env,
    experiments: Object.keys(state.experiments).map(k => state.experiments[k])
  }
}

export default connect(
  mapStateToProps
)(AsyncApp)
