/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const Notifications = require('sdk/notifications')
const querystring = require('sdk/querystring')
const tabs = require('sdk/tabs')

function notify (message) {
  Notifications.notify({
    title: message.title,
    text: `via testpilot.firefox.com\n${message.text}`,
    iconURL: './notification-icon.png',
    onClick: () => {
      const url = message.url + '?' + querystring.stringify({
        utm_source: 'testpilot-addon',
        utm_medium: 'firefox-browser',
        utm_campaign: 'push notification',
        utm_content: message.id
      })
      tabs.open(url)
    }
  })
}

module.exports = {
  notify
}
