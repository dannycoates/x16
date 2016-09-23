/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { SHOW_EXPERIMENT } from '../../../../common/actions'
import ExperimentList from '../../components/ExperimentList'

import './App.css'

class App extends Component {
  static propTypes = {
    baseUrl: PropTypes.string,
    experiments: ExperimentList.propTypes.experiments,
    dispatch: PropTypes.func.isRequired
  }

  render () {
    const { baseUrl, experiments, dispatch } = this.props
    return (
      <div>
        <ExperimentList
          experiments={experiments}
          onExperimentClick={url => dispatch(SHOW_EXPERIMENT({url}))}
        />
        <a className='view-all' href={baseUrl} onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          dispatch(SHOW_EXPERIMENT({url: baseUrl}))
        }}>View all experiments</a>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    baseUrl: state.baseUrl,
    experiments: Object.values(state.experiments).sort((a,b) => a.order - b.order)
  }
}

export default connect(mapStateToProps)(App)
