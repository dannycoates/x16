
const actions = require('./actions');
const { Class } = require('sdk/core/heritage');
const { emit, setListeners } = require('sdk/event/core');
const { EventTarget } = require('sdk/event/target');
const { Panel } = require('sdk/panel');
const tabs = require('sdk/tabs');
const { ToggleButton } = require('sdk/ui/button/toggle');
const { Request } = require('sdk/request');
const { setInterval, clearInterval } = require('sdk/timers');

let pollCount = 0;
function pollPanel(port) {
  this.panel.port.emit('ping', ++pollCount)
}

const UI = Class({
  implements: [EventTarget],
  initialize: function (store) {
    setListeners(this)
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
             height: this.store.getState().panelHeight
           });
         }
       }
    });

    // HACK
    this.pollInterval = setInterval(pollPanel.bind(this), 10)
    this.panel.port.once('pong', x => {
      clearInterval(this.pollInterval)
      console.error(`polled ${x} times`)
      emit(this, 'connected')
    })

  },
  openTab: function (url) {
    tabs.open(url)
    this.panel.hide()
  }
})

module.exports.UI = UI
