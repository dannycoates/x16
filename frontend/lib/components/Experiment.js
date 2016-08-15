import React, { Component, PropTypes } from 'react'

const NEW_EXPERIMENT_PERIOD = 14 * 24 * 60 * 60 * 1000; // 2 weeks

export default class Experiment extends Component {
  render() {
    const { onClick, title, html_url, created, modified, thumbnail, gradient_start, gradient_stop } = this.props
    const active = false // TODO
    const isNew = (new Date() - new Date(created)) < NEW_EXPERIMENT_PERIOD
    return (
      <a className={ ['experiment-item ', (active ? 'active' : (isNew ? 'is-new' : ''))].join(' ') } href={html_url} onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}>
        <div className="icon-wrapper" style={{ backgroundColor: gradient_start, backgroundImage: `linear-gradient(300deg, ${gradient_start}, ${gradient_stop})`}}>
          <div className="icon" style={{ backgroundImage: `url('${thumbnail}')` }}></div>
        </div>
        <div className="experiment-title">{title}
          <span className={['active-span', active ? 'active' : ''].join(' ')}>Enabled</span>
          <span className={['is-new-span', isNew && !active ? 'visible' : ''].join(' ')}>New Experiment</span>
        </div>
      </a>
    )
  }
}

Experiment.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  html_url: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  modified: PropTypes.string.isRequired,
  gradient_start: PropTypes.string.isRequired,
  gradient_stop: PropTypes.string.isRequired
}
