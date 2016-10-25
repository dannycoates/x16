/* global describe it */
import assert from 'assert'
import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'

import ExperimentList from '../lib/components/ExperimentList'

describe('ExperimentList', function () {
  it('renders all the experiments', function () {
    const xs = [
      { addon_id: 'a' },
      { addon_id: 'b' }
    ]
    const props = {
      experiments: xs,
      onExperimentClick: sinon.spy()
    }
    const l = shallow(<ExperimentList {...props} />)
    assert.equal(l.find('.experiment-list').children().length, xs.length)
  })
})
