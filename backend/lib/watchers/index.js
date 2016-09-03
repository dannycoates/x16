const { setBadge, maybeNotify } = require('../actions')
const WebExtensionChannels = require('../metrics/webextension-channels')

function getProp(selector, object) {
  const keys = selector.split('->').slice(1)
  let result = object
  for (let key of keys) {
    result = result[key]
  }
  return result
}

function checkNotifications(experimentSelector, store) {
  const state = store.getState()
  const experiment = getProp(experimentSelector, state)
  const { lastNotified, nextCheck } = state.notifications
  store.dispatch(maybeNotify(experiment, lastNotified, nextCheck))
}

function experimentChanged(change) {
  switch (change.prop) {
    case 'notifications':
      checkNotifications(change.target, this.store)
      break;
  }
}

function experimentAdded(watcher, change) {
  const selector = `${change.target}->${change.prop}`
  watcher.on(selector, experimentChanged)
  console.debug(`added ${selector}`)

  // maybe show the "New" badge
  const state = watcher.store.getState()
  const experiment = state.experiments[change.prop]
  const lastClicked = state.ui.clicked
  const created = (new Date(experiment.created)).getTime()
  if (created > lastClicked) {
    watcher.store.dispatch(setBadge('New'))
  }

  // wire up a webextension channel
  if (experiment.active) {
    WebExtensionChannels.add(experiment.addon_id)
  }

  checkNotifications(selector, watcher.store)
}

function experimentDeleted(watcher, change) {
  const selector = `${change.target}->${change.prop}`
  console.debug(`deleted ${selector}`)
  watcher.off(selector, experimentChanged)
}

function experimentListChanged(change) {
  switch (change.type) {
    case 'ADD':
      return experimentAdded(this, change)
    case 'DELETE':
      return experimentDeleted(this, change)
  }
}

function rootStateChanged(change) {
  if (change.type !== 'DELETE' && change.prop === 'experiments') {
    this.on('root->experiments', experimentListChanged)

    const experiments = this.store.getState().experiments
    for (let name of Object.keys(experiments)) {
      experimentAdded(
        this,
        {
          target: 'root->experiments',
          prop: name
        }
      )
    }
  }
}

module.exports = {
  rootStateChanged,
  experimentListChanged,
  experimentChanged
}
