/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { AddonManager } = require('resource://gre/modules/AddonManager.jsm');
const { ToggleButton } = require('sdk/ui/button/toggle');
const { Panel } = require('sdk/panel');
const { Request } = require('sdk/request');
const tabs = require('sdk/tabs');

let panelHeight = 500
let panelWidth = 300

const panel = Panel({
  contentURL: './index.html',
  onHide: () => {
    button.state('window', { checked: false });
  }
});

panel.port.on('state', state => {
  console.error('backend got state')
})

panel.port.on('action', action => {
  console.error(`backend received ${action.type}`)
  switch (action.type) {
    case 'SHOW_EXPERIMENT':
      const url = action.href === 'TODO' ? 'https://testpilot.firefox.com/experiments' : action.href
      tabs.open(url)
      panel.hide()
      break;
    case 'LOAD_EXPERIMENTS':
      const r = new Request({
        headers: { 'Accept': 'application/json' },
        url: 'https://testpilot.firefox.com/api/experiments'
      })
      r.on(
        'complete',
        res => {
          if (res.status === 200) {
            panel.port.emit(
              'action',
              {
                type: 'UPDATE_EXPERIMENTS',
                json: res.json
              }
            )
          }
        }
      )
      r.get()
      break;
    case 'LOAD_ADDONS':
      AddonManager.getAllAddons(addons => {
        panel.port.emit(
          'action',
          {
            type: 'UPDATE_ADDONS',
            addons
          }
        )
      })
      break;
    case 'INSTALL_EXPERIMENT':
      break;
    case 'UNINSTALL_EXPERIMENT':
      break;
    case 'CHANGE_PANEL_HEIGHT':
      panelHeight = action.height - 20
      console.error(`height: ${panelHeight}`)
      break;
  }
});

const button = ToggleButton({
   id: 'x16',
   label: 'X-16',
   icon: `./wolf.svg`,
   onChange: buttonChanged
});

function buttonChanged(state) {
  if (state.checked) {
    panel.show({
      position: button,
      width: panelWidth,
      height: panelHeight
    });
  }
}
