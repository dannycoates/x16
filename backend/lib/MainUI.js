/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import * as actions from '../../common/actions'
import { Panel } from 'sdk/panel'
import tabs from 'sdk/tabs'
import { ToggleButton } from 'sdk/ui/button/toggle'
import { setInterval, clearInterval } from 'sdk/timers'
import type { ReduxStore } from 'testpilot/types'

let pollCount = 0
function pollPanel () {
  this.panel.port.emit('ping', ++pollCount)
}

export default class MainUI {
  panel: Panel
  button: ToggleButton
  store: ReduxStore
  panelWidth: number
  pollInterval: number

  constructor (store: ReduxStore) {
    this.store = store
    this.panelWidth = 300
    this.panel = new Panel({
      contentURL: './index.html',
      onHide: () => {
        this.button.state('window', { checked: false })
      }
    })

    this.button = new ToggleButton({
      id: 'x16',
      label: 'X-16',
      icon: `./wolf.svg`,
      onChange: state => {
        if (state.checked) {
          store.dispatch(actions.MAIN_BUTTON_CLICKED({ time: Date.now() }))
        }
      }
    })

    // HACK - it takes a few cycles for messages to start flowing.
    // Before then they get dropped, so before we send anything
    // important ensure we can do a round trip.
    this.pollInterval = setInterval(pollPanel.bind(this), 10)
    this.panel.port.once('pong', (x: number) => {
      clearInterval(this.pollInterval)
      console.debug(`polled ${x} times`)
      store.dispatch(actions.FRONTEND_CONNECTED())
    })
  }

  showPanel () {
    this.panel.show({
      position: this.button,
      width: this.panelWidth,
      height: this.store.getState().ui.panelHeight
    })
  }

  openTab (url: string) {
    tabs.open(url)
    this.panel.hide()
  }

  setBadge () {
    this.button.badge = this.store.getState().ui.badge
  }
}
