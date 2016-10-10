/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

import actions from '../../../common/actions'
import { AddonManager } from 'resource://gre/modules/AddonManager.jsm'

function getExperiment (getState, addon) {
  const { experiments } = getState()
  return experiments[addon.id]
}

function toObject (addon) {
  return {
    id: addon.id,
    isActive: addon.isActive,
    pendingOperations: addon.pendingOperations,
    userDisabled: addon.userDisabled,
    installDate: addon.installDate
  }
}

export default class AddonListener {
  constructor ({dispatch, getState}) {
    this.getExperiment = getExperiment.bind(null, getState)
    this.dispatch = dispatch
    AddonManager.addAddonListener(this)
  }

  onEnabled (addon) {
    const experiment = this.getExperiment(addon)
    if (experiment) {
      this.dispatch(actions.EXPERIMENT_ENABLED({experiment}))
    }
  }

  onDisabled (addon) {
    const experiment = this.getExperiment(addon)
    if (experiment) {
      this.dispatch(actions.EXPERIMENT_DISABLED({experiment}))
    }
  }

  onUninstalling (addon) {
    const experiment = this.getExperiment(addon)
    if (experiment) {
      this.dispatch(actions.EXPERIMENT_UNINSTALLING({experiment}))
    }
  }

  onUninstalled (addon) {
    const experiment = this.getExperiment(addon)
    if (experiment) {
      this.dispatch(actions.EXPERIMENT_UNINSTALLED({experiment}))
    }
  }

  onOperationCancelled (addon) {
    console.debug('op cancelled', toObject(addon))
    const experiment = this.getExperiment(addon)
    if (experiment) {
      if (addon.pendingOperations & AddonManager.PENDING_ENABLE) {
        this.dispatch(actions.EXPERIMENT_ENABLED({experiment}))
      } else if (addon.userDisabled && addon.installDate) {
        this.dispatch(actions.EXPERIMENT_DISABLED({experiment}))
      }
    }
  }

  teardown () {
    AddonManager.removeAddonListener(this)
  }
}
