const actionTypes = require('../../common/actionTypes');
const { Class } = require('sdk/core/heritage');
const { emit, setListeners } = require('sdk/event/core');
const { EventTarget } = require('sdk/event/target');

function handler(hub, port, action) {
  // send to everyone else
  for (let p of hub.ports.keys()) {
    if (p !== port) {
      port.emit('action', action)
    }
  }
  emit(hub, action.type, action)
  // hub.dispatch(action)
}

function webToAction({type, data}) {
  let action = {}
  switch (type) {
    case 'install-experiment':
      action = {
        type: actionTypes.INSTALL_EXPERIMENT,
        experiment: data
      }
      break;
    case 'uninstall-experiment':
      action = {
        type: actionTypes.UNINSTALL_EXPERIMENT,
        experiment: data
      }
      break;
    case 'uninstall-self':
      action = {
        type: actionTypes.UNINSTALL_SELF
      }
      break;
    case 'sync-installed':
      action = {
        type: actionTypes.SYNC_INSTALLED
      }
      break;
  }
  console.error(`webapp action ${action.type}`)
  emit(this, action.type, action)
}

function actionToWeb(action) {
  switch (action.type) {
    case actionTypes.INSTALL_ENDED:
      return {
        type: 'addon-install:install-ended',
        data: action.addon
      }
    case actionTypes.EXPERIMENT_UNINSTALLED:
      return {
        type: 'addon-uninstall:uninstall-ended',
        data: action.experiment
      }
  }
}

const Hub = Class({
  implements: [EventTarget],
  initialize: function () {
    setListeners(this)
    this.ports = new Map()
    this.dispatch = function() {}
  },
  connect: function (port) {
    const fn = handler.bind(null, this, port)
    port.on('action', fn)
    // HACK
    port.on('from-web-to-addon', webToAction.bind(this))
    this.ports.set(port, fn)
  },
  disconnect: function (port) {
    const fn = this.ports.get(port)
    port.off('action', fn)
    port.off('from-web-to-addon')
    this.ports.delete(port)
  },
  middleware: function () {
    return (store) => {
      this.dispatch = store.dispatch
      return (next) => (action) => {
        action.meta = action.meta || {}
        action.meta.src = action.meta.src || 'backend'
        if (action.meta.src === 'backend') {
          for (let port of this.ports.keys()) {
            port.emit('action', action)
            // HACK
            const evt = actionToWeb(action)
            if (evt) { port.emit('from-addon-to-web', evt) }
          }
        }
        console.error(`backend processing ${action.type}:${action.meta.src}`)
        return next(action)
      }
    }
  }
})

module.exports = Hub
