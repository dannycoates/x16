/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const actionTypes = require('../../../common/actionTypes')

module.exports = {
  syncInstalled ({clientUUID, installed}) {
    return {
      type: actionTypes.SYNC_INSTALLED,
      payload: {
        clientUUID,
        installed
      }
    }
  },

  mainButtonClicked () {
    return {
      type: actionTypes.MAIN_BUTTON_CLICKED,
      payload: {
        time: Date.now()
      }
    }
  },

  selfInstalled (onboardingUrl) {
    return {
      type: actionTypes.SELF_INSTALLED,
      payload: {
        url: onboardingUrl
      }
    }
  },

  selfEnabled () {
    return {
      type: actionTypes.SELF_ENABLED
    }
  },

  selfDisabled () {
    return {
      type: actionTypes.SELF_DISABLED
    }
  },

  installEnded (experiment) {
    return {
      type: actionTypes.INSTALL_ENDED,
      payload: {
        experiment
      }
    }
  },

  installFailed (install) {
    return {
      type: actionTypes.INSTALL_FAILED,
      payload: {
        install
      }
    }
  },

  installStarted (install) {
    return {
      type: actionTypes.INSTALL_STARTED,
      payload: {
        install
      }
    }
  },

  installCancelled (install) {
    return {
      type: actionTypes.INSTALL_CANCELLED,
      payload: {
        install
      }
    }
  },

  downloadStarted (install) {
    return {
      type: actionTypes.DOWNLOAD_STARTED,
      payload: {
        install
      }
    }
  },

  downloadProgress (install) {
    return {
      type: actionTypes.DOWNLOAD_PROGRESS,
      payload: {
        install
      }
    }
  },

  downloadEnded (install) {
    return {
      type: actionTypes.DOWNLOAD_ENDED,
      payload: {
        install
      }
    }
  },

  downloadCancelled (install) {
    return {
      type: actionTypes.DOWNLOAD_CANCELLED,
      payload: {
        install
      }
    }
  },

  downloadFailed (install) {
    return {
      type: actionTypes.DOWNLOAD_FAILED,
      payload: {
        install
      }
    }
  },

  experimentEnabled (experiment) {
    return {
      type: actionTypes.EXPERIMENT_ENABLED,
      payload: {
        experiment
      }
    }
  },

  experimentDisabled (experiment) {
    return {
      type: actionTypes.EXPERIMENT_DISABLED,
      payload: {
        experiment
      }
    }
  },

  experimentUninstalling (experiment) {
    return {
      type: actionTypes.EXPERIMENT_UNINSTALLING,
      payload: {
        experiment
      }
    }
  },

  experimentUninstalled (experiment) {
    return {
      type: actionTypes.EXPERIMENT_UNINSTALLED,
      payload: {
        experiment
      }
    }
  },

  selfUninstalled (experiments) {
    return {
      type: actionTypes.SELF_UNINSTALLED
    }
  },

  setBadge (text) {
    return {
      type: actionTypes.SET_BADGE,
      payload: {
        text
      }
    }
  },

  loadingExperiments (env) {
    return {
      type: actionTypes.LOADING_EXPERIMENTS,
      payload: {
        env
      }
    }
  },

  experimentsLoaded (env, baseUrl, experiments) {
    return {
      type: actionTypes.EXPERIMENTS_LOADED,
      payload: {
        env,
        baseUrl,
        experiments
      }
    }
  },

  experimentsLoadError (res) {
    return {
      type: actionTypes.EXPERIMENTS_LOAD_ERROR,
      payload: {
        res
      }
    }
  },

  setRating (experiment, rating) {
    return {
      type: actionTypes.SET_RATING,
      payload: {
        time: Date.now(),
        experiment,
        rating
      }
    }
  },

  showRating (interval, experiment) {
    return {
      type: actionTypes.SHOW_RATING_PROMPT,
      payload: {
        experiment,
        interval
      }
    }
  },

  maybeNotify (experiment) {
    return {
      type: actionTypes.MAYBE_NOTIFY,
      payload: {
        experiment
      }
    }
  },

  scheduleNotifier (nextCheck, lastNotified) {
    return {
      type: actionTypes.SCHEDULE_NOTIFIER,
      payload: {
        nextCheck,
        lastNotified
      }
    }
  },

  loadExperiments (env, baseUrl) {
    return {
      type: actionTypes.LOAD_EXPERIMENTS,
      payload: {
        env,
        baseUrl
      }
    }
  }
}
