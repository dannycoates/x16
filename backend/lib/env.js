const aboutConfig = require('sdk/preferences/service');
const { Class } = require('sdk/core/heritage');
const environments = require('../../common/environments');
const { emit, setListeners } = require('sdk/event/core');
const { EventTarget } = require('sdk/event/target');
const { PrefsTarget } = require('sdk/preferences/event-target');
const self = require('sdk/self');

const prefs = PrefsTarget()
const target = EventTarget()
target.get = function () {
  return environments[aboutConfig.get('testpilot.env', 'production')]
}

if (!aboutConfig.has('testpilot.env')) {
  aboutConfig.set('testpilot.env', target.get().name);
}

if (aboutConfig.get('testpilot.dev') !== 'production') {
  aboutConfig.set(`extensions.${self.id}.sdk.console.logLevel`, 'debug')
}

prefs.on('testpilot.env', () => {
  emit(target, 'change', target.get());
});

module.exports = target
