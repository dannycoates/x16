/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const { Class } = require('sdk/core/heritage')
const { PageMod } = require('sdk/page-mod')

const WebApp = Class({
  initialize: function ({hub, baseUrl, whitelist, addonVersion}) {
    const pageIncludes = (baseUrl === '*') ? baseUrl : `${baseUrl}/*`
    const beaconIncludes = `${pageIncludes},${whitelist}`.split(',')

    this.page = new PageMod({
      include: pageIncludes,
      contentScriptFile: './message-bridge.js',
      contentScriptWhen: 'start',
      attachTo: ['top', 'existing'],
      onAttach: worker => {
        hub.connect(worker.port)
        worker.on('detach', () => hub.disconnect(worker.port))
      }
    })
    this.beacon = new PageMod({
      include: beaconIncludes,
      contentScriptFile: './set-installed-flag.js',
      contentScriptWhen: 'start',
      attachTo: ['top', 'existing'],
      contentScriptOptions: {
        version: addonVersion
      }
    })
  },
  teardown: function () {
    this.page.destroy()
    this.beacon.destroy()
  }
})

module.exports = WebApp
