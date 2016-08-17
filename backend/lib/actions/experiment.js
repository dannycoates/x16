
const actionTypes = require('../../../common/actionTypes');
const { AddonManager } = require('resource://gre/modules/AddonManager.jsm');
const { Class } = require('sdk/core/heritage');
const environments = require('../../../common/environments');
const { Request } = require('sdk/request');

const InstallListener = Class({
  initialize: function({install, dispatch}) {
    this.dispatch = dispatch
    install.addListener(this)
  },
  onInstallEnded: function (install, addon) {
    this.dispatch(installEnded({
      id: addon.id
    }))
  },
  onInstallFailed: function(install) {
    this.dispatch(installFailed(install))
  },
  onInstallStarted: function(install) {
    this.dispatch(installStarted(install))
  },
  onInstallCancelled: function(install) {
    this.dispatch(installCancelled(install))
  },
  onDownloadStarted: function(install) {
    this.dispatch(downloadStarted(install))
  },
  onDownloadProgress: function(install) {
    this.dispatch(downloadProgress(install))
  },
  onDownloadEnded: function(install) {
    this.dispatch(downloadEnded(install))
  },
  onDownloadCancelled: function(install) {
    this.dispatch(downloadCancelled(install))
  },
  onDownloadFailed: function(install) {
    this.dispatch(downloadFailed(install))
  }
})

function installEnded(addon) {
  return {
    type: actionTypes.INSTALL_ENDED,
    addon
  }
}

function installFailed(install) {
  return {
    type: actionTypes.INSTALL_FAILED,
    install
  }
}

function installStarted(install) {
  return {
    type: actionTypes.INSTALL_STARTED,
    install
  }
}

function installCancelled(install) {
  return {
    type: actionTypes.INSTALL_CANCELLED,
    install
  }
}

function downloadStarted(install) {
  return {
    type: actionTypes.DOWNLOAD_STARTED,
    install
  }
}

function downloadProgress(install) {
  return {
    type: actionTypes.DOWNLOAD_PROGRESS,
    install
  }
}

function downloadEnded(install) {
  return {
    type: actionTypes.DOWNLOAD_ENDED,
    install
  }
}

function downloadCancelled(install) {
  return {
    type: actionTypes.DOWNLOAD_CANCELLED,
    install
  }
}

function downloadFailed(install) {
  return {
    type: actionTypes.DOWNLOAD_FAILED,
    install
  }
}

function loadingExperiments(env) {
  return {
    type: actionTypes.LOADING_EXPERIMENTS,
    env
  }
}

function experimentsLoaded(env, experiments) {
  return {
    type: actionTypes.EXPERIMENTS_LOADED,
    env,
    experiments
  }
}

function experimentsLoadError(res) {
  return {
    type: actionTypes.EXPERIMENTS_LOAD_ERROR,
    res
  }
}

function experimentEnabled(experiment) {
  return {
    type: actionTypes.EXPERIMENT_ENABLED,
    experiment
  }
}

function experimentDisabled(experiment) {
  return {
    type: actionTypes.EXPERIMENT_DISABLED,
    experiment
  }
}

function experimentUninstalling(experiment) {
  return {
    type: actionTypes.EXPERIMENT_UNINSTALLING,
    experiment
  }
}

function experimentUninstalled(experiment) {
  return {
    type: actionTypes.EXPERIMENT_UNINSTALLED,
    experiment
  }
}

function installExperiment(experiment) {
  return (dispatch) => {
    AddonManager.getInstallForURL(
      experiment.xpi_url,
      install => {
        install.addListener(new InstallListener({ install, dispatch }))
        install.install()
      },
      'application/x-xpinstall'
    )
  }
}

function uninstallExperiment(experiment) {
  return (dispatch) => {
    AddonManager.getAddonByID(experiment.addon_id, a => {
      if (a) { a.uninstall(); }
    });
  }
}

function fetchExperiments(url) {
  return new Promise(
    (resolve, reject) => {
      const r = new Request({
        headers: { 'Accept': 'application/json' },
        url
      });
      r.on(
        'complete',
        res => {
          if (res.status === 200) {
            const experiments = {};
            for (let xp of res.json.results) { // eslint-disable-line prefer-const
              experiments[xp.addon_id] = xp;
            }
            resolve(experiments)
          } else {
            reject(res)
          }
        }
      );
      r.get();
    }
  )
}

function mergeAddonActiveState(experiments, addons) {
  Object.keys(experiments).forEach(k => experiments[k].active = false)
  for (let addon of addons) {
    const x = experiments[addon.id]
    if (x) {
      x.active = true
      x.installDate = addon.installDate
    }
  }
  return experiments
}

function loadExperiments(newEnv) {
  return (dispatch) => {
    const baseUrl = environments[newEnv].baseUrl
    dispatch(loadingExperiments(newEnv))
    return fetchExperiments(`${baseUrl}/api/experiments`)
      .then(
        xs => new Promise(
          (resolve, reject) => {
            AddonManager.getAllAddons(
              addons => {
                resolve(mergeAddonActiveState(xs, addons))
              }
            )
          }
        )
      )
      .then(
        xs => dispatch(experimentsLoaded(newEnv, xs)),
        err => dispatch(experimentsLoadError(err))
      )
  }
}

function getExperiments(newEnv) {
  return (dispatch, getState) => {
    const { env, experiments } = getState()
    if (newEnv === env) {
      console.error('returned cached experiments')
      return dispatch(experimentsLoaded(env, experiments))
    }
    return loadExperiments(newEnv)(dispatch)
  }
}

module.exports = {
  experimentEnabled,
  experimentDisabled,
  experimentUninstalling,
  experimentUninstalled,
  installExperiment,
  uninstallExperiment,
  loadExperiments,
  getExperiments
}
