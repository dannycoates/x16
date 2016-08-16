
const { AddonManager } = require('resource://gre/modules/AddonManager.jsm');
const { Class } = require('sdk/core/heritage');
const environments = require('../environments');

const InstallListener = Class({
  initialize: function({install, dispatch}) {
    this.dispatch = dispatch
    install.addListener(this)
  },
  onInstallEnded: function (install, addon) {
    this.dispatch(installEnded(addon))
  },
  onInstallFailed: function(install) {
    this.dispatch(installFailed(addon))
  },
  onInstallStarted: function(install) {
    this.dispatch(installStarted(addon))
  },
  onInstallCancelled: function(install) {
    this.dispatch(installCancelled(addon))
  },
  onDownloadStarted: function(install) {
    this.dispatch(downloadStarted(addon))
  },
  onDownloadProgress: function(install) {
    this.dispatch(downloadProgress(addon))
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
    type: 'INSTALL_ENDED',
    addon
  }
}

function installFailed(install) {
  return {
    type: 'INSTALL_FAILED',
    install
  }
}

function installStarted(install) {
  return {
    type: 'INSTALL_STARTED',
    install
  }
}

function installCancelled(install) {
  return {
    type: 'INSTALL_CANCELLED',
    install
  }
}

function downloadStarted(install) {
  return {
    type: 'DOWNLOAD_STARTED',
    install
  }
}

function downloadProgress(install) {
  return {
    type: 'DOWNLOAD_PROGRESS',
    install
  }
}

function downloadEnded(install) {
  return {
    type: 'DOWNLOAD_ENDED',
    install
  }
}

function downloadCancelled(install) {
  return {
    type: 'DOWNLOAD_CANCELLED',
    install
  }
}

function downloadFailed(install) {
  return {
    type: 'DOWNLOAD_FAILED',
    install
  }
}

function loadingExperiments(env) {
  return {
    type: 'LOADING_EXPERIMENTS',
    env
  }
}

function experimentsLoaded(experiments) {
  return {
    type: 'EXPERIMENTS_LOADED',
    experiments
  }
}

function experimentsLoadError(res) {
  return {
    type: 'EXPERIMENTS_LOAD_ERROR',
    res
  }
}

function experimentEnabled(experiment) {
  return {
    type: 'EXPERIMENT_ENABLED',
    experiment
  }
}

function experimentDisabled(experiment) {
  return {
    type: 'EXPERIMENT_DISABLED',
    experiment
  }
}

function experimentUninstalling(experiment) {
  return {
    type: 'EXPERIMENT_UNINSTALLING',
    experiment
  }
}

function experimentUninstalled(experiment) {
  return {
    type: 'EXPERIMENT_UNINSTALLED',
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
  AddonManager.getAddonByID(experiment.addon_id, a => {
    if (a) { a.uninstall(); }
  });
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
  for (addon of addons) {
    const x = experiments[addon.id]
    if (x) {
      x.active = true
      x.installDate = addon.installDate
    }
  }
  return experiments
}

function loadExperiments(env) {
  return (dispatch) => {
    const baseUrl = environments[env].baseUrl
    dispatch(loadingExperiments(env))
    return fetchExperiments(`${baseUrl}/api/experiments`)
      .then(
        xs => AddonManager.getAllAddons(mergeAddonActiveState.bind(null, xs))
      )
      .then(
        xs => dispatch(experimentsLoaded(xs))
      )
      .catch(err => dispatch(experimentsLoadFailed(err)))
  }
}

module.exports = {
  experimentEnabled,
  experimentDisabled,
  experimentUninstalling,
  experimentUninstalled,
  installExperiment,
  uninstallExperiment,
  loadExperiments
}
