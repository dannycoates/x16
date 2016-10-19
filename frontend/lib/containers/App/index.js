/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */
/* global Event */

// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { SHOW_EXPERIMENT } from '../../../../common/actions'
import ExperimentList from '../../components/ExperimentList'

import type { FrontendState } from 'testpilot/types'
import type { Dispatch } from 'redux'

import './App.css'

import type { ExperimentProps } from '../../components/Experiment'

// https://flowtype.org/docs/react.html#defining-components-as-reactcomponent-subclasses
type AppProps = {
  baseUrl: string,
  experiments: Array<ExperimentProps>,
  showExperiment: (url: string) => void
}

class App extends Component {
  props: AppProps

  render () {
    const { baseUrl, experiments, showExperiment } = this.props
    return (
      <div>
        <ExperimentList
          experiments={experiments}
          onExperimentClick={(url: string) => showExperiment(url)}
        />
        <a className='view-all' href={baseUrl} onClick={(e: Event) => {
          e.preventDefault()
          e.stopPropagation()
          showExperiment(baseUrl)
        }}>View all experiments</a>
      </div>
    )
  }
}

export default connect(
  (state: FrontendState) => ({
    baseUrl: state.baseUrl,
    experiments: Object.keys(state.experiments)
      .map(id => state.experiments[id])
      .sort((a, b) => a.order - b.order)
  }),
  (dispatch: Dispatch) => ({
    showExperiment: (url: string) => dispatch(SHOW_EXPERIMENT({url}))
  })
)(App)
