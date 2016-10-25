/* global describe it */
import assert from 'assert'
import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'

import Experiment from '../lib/components/Experiment'

const defaultProps = {
  addon_id: 't',
  title: 'Test Addon',
  thumbnail: 'http://example.com/t.png',
  html_url: 'http://example.com',
  active: true,
  created: '2016-08-23',
  modified: '2016-09-21',
  gradient_start: '#FFFFFF',
  gradient_stop: '#000000',
  onClick: sinon.spy()
}

function makeClick () {
  return {
    preventDefault: sinon.spy(),
    stopPropagation: sinon.spy()
  }
}

describe('Experiment', function () {
  it('is labelled as Enabled when active', function () {
    const x = shallow(<Experiment {...defaultProps} />)
    assert.equal(x.find('.active-span').length, 1)
    assert.equal(x.find('.active-span').text(), 'Enabled')
  })

  it('is labelled as Disabled when installed but not active', function () {
    const props = { ...defaultProps, active: false, installDate: '2016-10-23' }
    const x = shallow(<Experiment {...props} />)
    assert.equal(x.find('.disabled-span').length, 1)
    assert.equal(x.find('.disabled-span').text(), 'Disabled')
  })

  it('is labelled as Installing when installing', function () {
    const props = {
      ...defaultProps,
      active: false,
      install: { progress: 7, maxProgress: 10 }
    }
    const x = shallow(<Experiment {...props} />)
    assert.equal(x.find('.active-span').length, 1)
    assert.equal(x.find('.active-span').text(), 'Installing')
  })

  it('is labelled as New Experiment when new', function () {
    const props = { ...defaultProps, active: false, created: (new Date()).toISOString() }
    const x = shallow(<Experiment {...props} />)
    assert.equal(x.find('.is-new-span').length, 1)
    assert.equal(x.find('.is-new-span').text(), 'New Experiment')
  })

  it('displays the title', function () {
    const props = { ...defaultProps, active: false }
    const x = shallow(<Experiment {...props} />)
    assert.equal(x.find('.experiment-title').length, 1)
    assert.equal(x.find('.experiment-title').text(), props.title)
  })

  it('calls the onClick prop on click', function () {
    const props = { ...defaultProps, onClick: sinon.spy() }
    const x = shallow(<Experiment {...props} />)
    const click = makeClick()
    x.find('.experiment-item').simulate('click', click)
    assert.ok(click.preventDefault.calledOnce)
    assert.ok(click.stopPropagation.calledOnce)
    assert.ok(props.onClick.calledOnce)
    assert.ok(props.onClick.calledWith(props.html_url))
  })
})
