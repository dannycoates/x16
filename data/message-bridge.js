/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

/* global cloneInto self CustomEvent */

// Page script acts as messaging bridge between addon and web content.
unsafeWindow.navigator.testpilotAddon = true

// New channel
self.port.on('action', function (data) {
  const clonedData = cloneInto(data, document.defaultView)
  document.documentElement.dispatchEvent(new CustomEvent(
    'addon-action', { bubbles: true, detail: clonedData }
  ))
})

function onAction (event) {
  self.port.emit('action', event.detail)
}

window.addEventListener('action', onAction, false)

// Legacy channel
self.port.on('from-addon-to-web', function (data) {
  const clonedData = cloneInto(data, document.defaultView)
  document.documentElement.dispatchEvent(new CustomEvent(
    'from-addon-to-web', { bubbles: true, detail: clonedData }
  ))
})

function onWebToAddon (event) {
  // HACK: for use with the 'any' environment
  if (event && event.detail && event.detail.type === 'sync-installed') {
    self.port.emit('from-web-to-addon', { type: 'base-url', data: window.location.origin })
  }
  self.port.emit('from-web-to-addon', event.detail)
}

window.addEventListener('from-web-to-addon', onWebToAddon, false)

// Cleanup
self.port.on('detach', function () {
  window.removeEventListener('from-web-to-addon', onWebToAddon)
  window.removeEventListener('action', onAction)
})
