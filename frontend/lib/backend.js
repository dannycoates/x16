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
    this.port = comm ? comm.port : fakePort
    this.port.on('action', action => {
      this.store.dispatch(action)
    })
  }

  set store(it) { this._store = it }
  get store() { return this._store }

  send(action) {
    this.port.emit('action', action)
  }
}

const backend = new Backend()

export default backend
