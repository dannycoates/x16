
const actions = require('./actions/experiment');
const { Class } = require('sdk/core/heritage');
const { Panel } = require('sdk/panel');
const tabs = require('sdk/tabs');
const { ToggleButton } = require('sdk/ui/button/toggle');
const { Request } = require('sdk/request');

const UI = Class({
  initialize: function (store) {
    this.store = store
    this.panelWidth = 300
    this.panel = Panel({
      contentURL: './index.html',
      onHide: () => {
        this.button.state('window', { checked: false });
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
             height: 475// TODO this.store.getState().panelHeight
           });
         }
       }
    });
  },
  send: function (action) {
    this.panel.port.emit('action', action)
  },
  openTab: function (url) {
    tabs.open(url)
    this.panel.hide()
  }
})

module.exports.UI = UI
