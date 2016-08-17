module.exports = {
  local: {
    baseUrl: 'http://testpilot.dev:8000',
    whitelist: 'https://www.mozilla.org/*,about:home'
  },
  dev: {
    baseUrl: 'http://testpilot.dev.mozaws.net',
    whitelist: 'https://www.mozilla.org/*,about:home'
  },
  stage: {
    baseUrl: 'https://testpilot.stage.mozaws.net',
    whitelist: 'https://www.mozilla.org/*,about:home'
  },
  production: {
    baseUrl: 'https://testpilot.firefox.com',
    whitelist: 'https://www.mozilla.org/*,about:home'
  }
}
