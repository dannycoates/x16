/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { Class } = require('sdk/core/heritage')
const { PageMod } = require('sdk/page-mod')

const WebApp = Class({
  initialize: function (options) {
    this.baseUrl = options.baseUrl
    this.workers = new Set()
    this.hub = options.hub

    let pageIncludes = this.baseUrl
    if (this.baseUrl !== '*') { pageIncludes += '/*' }
    this.page = new PageMod({
      include: pageIncludes,
      contentScriptFile: './message-bridge.js',
      contentScriptWhen: 'start',
      attachTo: ['top', 'existing']
    })
    this.page.on(
      'attach',
      worker => {
        this.hub.connect(worker.port)
        this.workers.add(worker)
        worker.on('detach', () => {
          this.hub.disconnect(worker.port)
          this.workers.delete(worker)
        })
      }
    )
    const beaconIncludes = (pageIncludes + ',' + options.whitelist).split(',')
    this.beacon = new PageMod({
      include: beaconIncludes,
      contentScriptFile: './set-installed-flag.js',
      contentScriptWhen: 'start',
      attachTo: ['top', 'existing'],
      contentScriptOptions: {
        version: options.addonVersion
      }
    })
  },
  teardown: function () {
    this.page.destroy()
    this.beacon.destroy()
  }
})

module.exports = WebApp
