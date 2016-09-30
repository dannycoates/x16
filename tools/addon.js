/* global CustomEvent */

window.addEventListener('addon-action', event => {
  commEvents.action(event.detail)
})

function send (action) {
  document.documentElement.dispatchEvent(new CustomEvent('action', { bubbles: true, detail: action }))
}

const commEvents = {}

const port = {
  on: function (name, fn) {
    commEvents[name] = fn
  },
  emit: function (name, data) {
    send(data)
  }
}

window.addon = { port }
