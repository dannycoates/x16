const { Class } = require('sdk/core/heritage');
const { emit, setListeners } = require('sdk/event/core');
const { EventTarget } = require('sdk/event/target');
const { loadExperiments } = require('./actions/experiment')
const { PageMod } = require('sdk/page-mod');

const WebApp = Class({ // eslint-disable-line new-cap
  implements: [EventTarget],
  initialize: function(options) {
    setListeners(this, options);
    this.baseUrl = options.baseUrl;
    this.workers = new Set();

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
        this.workers.add(worker);
        worker.on('detach', () => this.workers.delete(worker));
        worker.port.on('from-web-to-addon', ev => emit(this, ev.type, ev.data));
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
  send: function(type, data) {
    for (let worker of this.workers) { // eslint-disable-line prefer-const
      worker.port.emit('from-addon-to-web', {type: type, data: data});
    }
  },
  destroy: function() {
    this.page.destroy();
    this.beacon.destroy();
  }
});

exports.WebApp = WebApp;
