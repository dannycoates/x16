
const actionTypes = require('../../../common/actionTypes');
const { AddonManager } = require('resource://gre/modules/AddonManager.jsm');
const { Class } = require('sdk/core/heritage');
const environments = require('../../../common/environments');
const { Request } = require('sdk/request');
const self = require('sdk/self');
const _ = require('lodash/object');

const InstallListener = Class({
  initialize: function({install, dispatch}) {
    this.dispatch = dispatch
    install.addListener(this)
  },
  onInstallEnded: function (install, addon) {
    this.dispatch(installEnded({
      addon_id: addon.id
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

function installEnded(experiment) {
  return {
    type: actionTypes.INSTALL_ENDED,
    experiment
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
  return () => {
    AddonManager.getAddonByID(experiment.addon_id, a => {
      if (a) { a.uninstall(); }
    });
  }
}

function uninstallSelf() {
  return (dispatch, getState) => {
    const xs = _.values(_.pickBy(getState().experiments, x => x.active))
    xs.forEach(x => uninstallExperiment(x)())
    AddonManager.getAddonByID(self.id, a => a.uninstall())
  }
}

function urlify(baseUrl, experiment) {
  const urlFields = {
    '': ['thumbnail', 'url', 'html_url', 'installations_url', 'survey_url'],
    details: ['image'],
    tour_steps: ['image'],
    contributors: ['avatar']
  };
  Object.keys(urlFields).forEach(key => {
    const items = (key === '') ? [experiment] : experiment[key];
    items.forEach(item => urlFields[key].forEach(field => {
      // If the URL is not absolute, prepend the environment's base URL.
      if (item[field].substr(0, 1) === '/') {
        item[field] = baseUrl + item[field];
      }
    }));
  });
  return experiment;
}

function fetchExperiments(baseUrl, path) {
  return new Promise(
    (resolve, reject) => {
      const r = new Request({
        headers: { 'Accept': 'application/json' },
        url: baseUrl + path
      });
      r.on(
        'complete',
        res => {
          if (res.status === 200) {
            const experiments = {};
            for (let xp of res.json.results) {
              experiments[xp.addon_id] = urlify(baseUrl, xp);
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
    return fetchExperiments(baseUrl, '/api/experiments.json')
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

function syncInstalled({clientUUID, installed}) {
  return {
    type: actionTypes.SYNC_INSTALLED,
    clientUUID,
    installed
  }
}

module.exports = {
  experimentEnabled,
  experimentDisabled,
  experimentUninstalling,
  experimentUninstalled,
  installExperiment,
  uninstallExperiment,
  uninstallSelf,
  loadExperiments,
  syncInstalled
}
