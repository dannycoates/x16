/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */
/* eslint-disable camelcase */

import React, { Component, PropTypes } from 'react'

import './Experiment.css'

const NEW_EXPERIMENT_PERIOD = 14 * 24 * 60 * 60 * 1000 // 2 weeks

export default class Experiment extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    html_url: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    created: PropTypes.string.isRequired,
    modified: PropTypes.string.isRequired,
    gradient_start: PropTypes.string.isRequired,
    gradient_stop: PropTypes.string.isRequired
  }

  render () {
    const { onClick, title, html_url, active, created, thumbnail, gradient_start, gradient_stop } = this.props
    const isNew = (new Date() - new Date(created)) < NEW_EXPERIMENT_PERIOD
    return (
      <a className={['experiment-item ', (active ? 'active' : (isNew ? 'is-new' : ''))].join(' ')} href={html_url} onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}>
        <div className='icon-wrapper' style={{ backgroundColor: gradient_start, backgroundImage: `linear-gradient(300deg, ${gradient_start}, ${gradient_stop})` }}>
          <div className='icon' style={{ backgroundImage: `url('${thumbnail}')` }} />
        </div>
        <div className='experiment-title'>{title}
          <span className={['active-span', active ? 'active' : ''].join(' ')}>Enabled</span>
          <span className={['is-new-span', isNew && !active ? 'visible' : ''].join(' ')}>New Experiment</span>
        </div>
      </a>
    )
  }
}
