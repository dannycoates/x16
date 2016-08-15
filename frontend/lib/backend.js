function noop() {}

const fakePort = {
  on: noop,
  emit: noop
}

const fakeStore = {
  dispatch: noop
}

let comm = null

if (typeof(addon) !== 'undefined') {
  comm = addon
}
else if (typeof(self) !== 'undefined') {
  comm = self
}

class Backend {
  constructor() {
    this._store = fakeStore
    this.unsubscribe = noop
    this.port = comm ? comm.port : fakePort
    this.port.on('action', action => {
      console.error(`received ${action.type}`)
      this.store.dispatch(action)
    })
  }

  set store(it) {
    if (this.unsubscribe) { this.unsubscribe() }
    this._store = it
    this.unsubscribe = this.store.subscribe(() => {
      this.port.emit('state', this.store.getState())
    })
  }

  get store() { return this._store }

  send(action) {
    console.error(`send ${action.type}`)
    this.port.emit('action', action)
  }
}

const backend = new Backend()

export default backend
