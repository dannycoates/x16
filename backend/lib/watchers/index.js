const { setBadge } = require('../actions')

function experimentChanged(change) {
  switch (change.prop) {
    case 'notifications':
      // TODO
      console.debug(change)
      break;
  }
}

function experimentAdded(watcher, change) {
  const selector = `${change.target}->${change.prop}`
  watcher.on(selector, experimentChanged)
  console.debug(`added ${selector}`)

  const state = watcher.store.getState()
  const lastClicked = state.ui.clicked
  const created = (new Date(state.experiments[change.prop].created)).getTime()
  if (created > lastClicked) {
    watcher.store.dispatch(setBadge('New'))
  }
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
    console.debug(change)
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
  experimentListChanged
}
