/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

import actions from '../../../common/actions'

function toObject (install, experiment) {
  // install properties aren't enumerable
  return {
    addon_id: experiment.addon_id,
    type: install.type,
    state: install.state,
    error: install.error,
    progress: install.progress,
    maxProgress: install.maxProgress
  }
}

export default class InstallListener {
  constructor ({install, experiment, dispatch}) {
    this.dispatch = dispatch
    this.experiment = experiment
    install.addListener(this)
  }

  onInstallEnded (install, addon) {
    this.dispatch(actions.INSTALL_ENDED({
      experiment: {
        addon_id: addon.id,
        installDate: addon.installDate
      }
    }))
  }

  onInstallFailed (install) {
    install = toObject(install, this.experiment)
    this.dispatch(actions.INSTALL_FAILED({install}))
  }

  onInstallStarted (install) {
    install = toObject(install, this.experiment)
    this.dispatch(actions.INSTALL_STARTED({install}))
  }

  onInstallCancelled (install) {
    install = toObject(install, this.experiment)
    this.dispatch(actions.INSTALL_CANCELLED({install}))
  }

  onDownloadStarted (install) {
    install = toObject(install, this.experiment)
    this.dispatch(actions.DOWNLOAD_STARTED({install}))
  }

  onDownloadProgress (install) {
    install = toObject(install, this.experiment)
    this.dispatch(actions.DOWNLOAD_PROGRESS({install}))
  }

  onDownloadEnded (install) {
    install = toObject(install, this.experiment)
    this.dispatch(actions.DOWNLOAD_ENDED({install}))
  }

  onDownloadCancelled (install) {
    install = toObject(install, this.experiment)
    this.dispatch(actions.DOWNLOAD_CANCELLED({install}))
  }

  onDownloadFailed (install) {
    install = toObject(install, this.experiment)
    this.dispatch(actions.DOWNLOAD_FAILED({install}))
  }
}
