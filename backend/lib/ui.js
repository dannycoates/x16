
const { Class } = require('sdk/core/heritage');
const { Panel } = require('sdk/panel');
const tabs = require('sdk/tabs');
const { ToggleButton } = require('sdk/ui/button/toggle');
const { Request } = require('sdk/request');

const UI = Class({
  initialize: function (store) {
    this.store = store
    this.panelWidth = 300
    this.panelHeight = 500
    this.panel = Panel({
      contentURL: './index.html',
      onHide: () => {
        this.button.state('window', { checked: false });
      }
    });
    this.panel.port.on('state', state => {
      console.error('backend got state')
    })
    this.panel.port.on('action', action => {
      console.error(`backend received ${action.type}`)
      switch (action.type) {
        case 'SHOW_EXPERIMENT':
          const url = action.href === 'TODO' ? 'https://testpilot.firefox.com/experiments' : action.href
          tabs.open(url)
          this.panel.hide()
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
                this.panel.port.emit(
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
        case 'CHANGE_PANEL_HEIGHT':
          this.panelHeight = action.height - 20
          break;
      }
    });

    this.button = ToggleButton({
       id: 'x16',
       label: 'X-16',
       icon: `./wolf.svg`,
       onChange: state => {
         if (state.checked) {
           this.panel.show({
             position: this.button,
             width: this.panelWidth,
             height: this.panelHeight
           });
         }
       }
    });
  }
})

module.exports.UI = UI
