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
    addon_id: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    html_url: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    created: PropTypes.string.isRequired,
    modified: PropTypes.string.isRequired,
    gradient_start: PropTypes.string.isRequired,
    gradient_stop: PropTypes.string.isRequired,
    installDate: PropTypes.any,
    install: PropTypes.object
  }

  progressPath () {
    const r = 27
    const { progress, maxProgress } = this.props.install
    const percent = progress / maxProgress
    const a = (360 * percent) / 180 * Math.PI
    const x = r * Math.sin(a) + r + 1
    const y = r * (1 - Math.cos(a)) + 1
    return (percent < 0.5
      ? `M 28 1 A 27 27, 0, 0, 1, ${x}, ${y}`
      : `M 28 1 A 27 27, 0, 0, 1, 28, 55 M 28 55 A 27 27, 0, 0, 1, ${x}, ${y}`)
  }

  render () {
    const {
      addon_id,
      onClick,
      title,
      html_url,
      active,
      created,
      thumbnail,
      gradient_start,
      gradient_stop,
      installDate,
      install } = this.props
    const isNew = (new Date() - new Date(created)) < NEW_EXPERIMENT_PERIOD
    const gradient = `${addon_id}_gradient`

    let status = ''
    let labelClass = ''
    if (active) {
      status = 'Enabled'
      labelClass = 'active-span'
    } else if (install) {
      status = 'Installing'
      labelClass = 'active-span'
    } else if (installDate) {
      status = 'Disabled'
      labelClass = 'disabled-span'
    } else if (isNew) {
      status = 'New Experiment'
      labelClass = 'is-new-span'
    }

    return (
      <a className={['experiment-item ', (active ? 'active' : '')].join(' ')} href={html_url} onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        onClick(html_url)
      }}>
        <svg width='60' height='56' viewBox='0 0 60 56'>
          <defs>
            <linearGradient id={gradient} gradientTransform='rotate(30)'>
              <stop offset='0.2' stopColor={gradient_stop} />
              <stop offset='1' stopColor={gradient_start} />
            </linearGradient>
          </defs>
          <circle cx='28' cy='28' r='25' fill={`url(#${gradient})`} stroke='white' strokeWidth='2' />
          <image xlinkHref={thumbnail} x='16' y='16' height='24' width='24' />
          {install && <path d={this.progressPath()} fill='none' stroke='#57bd35' strokeWidth='2' />}
          {active &&
            <g>
              <circle cx='28' cy='28' r='27' fill='none' stroke='#57bd35' strokeWidth='2' />
              <circle cx='49' cy='11' r='10' fill='#57bd35' stroke='white' strokeWidth='2' />
              <polyline points='44 11, 48 15, 54 8' fill='none' stroke='white' strokeWidth='3' />
            </g>}
          {status === 'Disabled' && <circle cx='28' cy='28' r='27' fill='none' stroke='#F5570E' strokeWidth='2' />}
        </svg>
        <div className='experiment-title'>
          {title}
          <span className={labelClass}>{status}</span>
        </div>
      </a>
    )
  }
}
