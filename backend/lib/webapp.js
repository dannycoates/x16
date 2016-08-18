const { Class } = require('sdk/core/heritage');
const { PageMod } = require('sdk/page-mod');

const WebApp = Class({ // eslint-disable-line new-cap
  initialize: function(options) {
    this.baseUrl = options.baseUrl;
    this.workers = new Set();
    this.hub = options.hub

    const pageIncludes = this.baseUrl + '/*';
    this.page = new PageMod({
      include: pageIncludes,
      contentScriptFile: './message-bridge.js',
      contentScriptWhen: 'start',
      attachTo: ['top', 'existing']
    });
    this.page.on(
      'attach',
      worker => {
        this.hub.connect(worker.port)
        this.workers.add(worker);
        worker.on('detach', () => {
          this.hub.disconnect(worker.port)
          this.workers.delete(worker)
        });
      }
    );
    const beaconIncludes = (pageIncludes + ',' + options.whitelist).split(',');
    this.beacon = new PageMod({
      include: beaconIncludes,
      contentScriptFile: './set-installed-flag.js',
      contentScriptWhen: 'start',
      attachTo: ['top', 'existing'],
      contentScriptOptions: {
        version: options.addonVersion
      }
    });
  },
  destroy: function() {
    this.page.destroy();
    this.beacon.destroy();
  }
});

exports.WebApp = WebApp;
