/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

import { PageMod } from 'sdk/page-mod'

function toIncludes (baseUrl, whitelist) {
  const page = (baseUrl === '*') ? baseUrl : `${baseUrl}/*`
  const beacon = `${page},${whitelist}`.split(',')
  return { page, beacon }
}

export default class WebApp {
  constructor ({hub, baseUrl, whitelist, addonVersion}) {
    this.hub = hub
    this.addonVersion = addonVersion
    this.createMods(toIncludes(baseUrl, whitelist))
  }

  createMods (includes) {
    this.page = new PageMod({
      include: includes.page,
      contentScriptFile: './message-bridge.js',
      contentScriptWhen: 'start',
      attachTo: ['top', 'existing'],
      onAttach: worker => {
        this.hub.connect(worker.port)
        worker.on('detach', () => this.hub.disconnect(worker.port))
      }
    })
    this.beacon = new PageMod({
      include: includes.beacon,
      contentScriptFile: './set-installed-flag.js',
      contentScriptWhen: 'start',
      attachTo: ['top', 'existing'],
      contentScriptOptions: {
        version: this.addonVersion
      }
    })
  }

  changeEnv ({baseUrl, whitelist}) {
    this.teardown()
    this.createMods(toIncludes(baseUrl, whitelist))
  }

  teardown () {
    this.page.destroy()
    this.beacon.destroy()
  }
}
