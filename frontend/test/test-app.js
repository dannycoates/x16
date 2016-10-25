/* global describe it */
import assert from 'assert'
import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'

import { App } from '../lib/containers/App'

describe('App', function () {
  it('renders the experiment list', function () {
    const xs = [
      { addon_id: 'a', order: 1 },
      { addon_id: 'b', order: 2 }
    ]
    const props = {
      baseUrl: 'test',
      experiments: xs,
      showExperiment: sinon.spy()
    }
    const a = shallow(<App {...props} />)
    assert.equal(a.find('ExperimentList').length, 1)
  })

  it('renders the view all experiment link', function () {
    const xs = [
      { addon_id: 'a', order: 1 },
      { addon_id: 'b', order: 2 }
    ]
    const props = {
      baseUrl: 'test',
      experiments: xs,
      showExperiment: sinon.spy()
    }
    const click = {
      preventDefault: sinon.spy(),
      stopPropagation: sinon.spy()
    }
    const a = shallow(<App {...props} />)
    const viewAll = a.find({ href: 'test' })
    assert.equal(viewAll.length, 1)
    viewAll.simulate('click', click)
    assert.ok(click.preventDefault.calledOnce)
    assert.ok(click.stopPropagation.calledOnce)
    assert.ok(props.showExperiment.calledOnce)
    assert.ok(props.showExperiment.calledWith(props.baseUrl))
  })
})
