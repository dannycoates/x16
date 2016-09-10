/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const Notifications = require('sdk/notifications');
const querystring = require('sdk/querystring');
const tabs = require('sdk/tabs');
const ONE_DAY = 24 * 60 * 60 * 1000
const MAX_NOTIFICATION_DELAY_PERIOD = 14 * ONE_DAY;

function notify(message) {
  Notifications.notify({
    title: message.title,
    text: `via testpilot.firefox.com\n${message.text}`,
    iconURL: './notification-icon.png',
    onClick: () => {
      const url = message.url + '?' + querystring({
        utm_source: 'testpilot-addon',
        utm_medium: 'firefox-browser',
        utm_campaign: 'push notification',
        utm_content: message.id
      })
      tabs.open(url)
    }
  })
}

function selectNotification(notifications, lastNotified) {
  const now = Date.now()
  const eligible = notifications.filter(n => {
    const now = Date.now()
    const after = (new Date(n.notify_after)).getTime()
    return (now - after < MAX_NOTIFICATION_DELAY_PERIOD) &&
      (now > after) &&
      (after > lastNotified)
  })
  return eligible[Math.floor(Math.random() * eligible.length)] // undefined is ok
}

function nextCheckTime(notifications, nextCheck) {
  const now = Date.now()
  return notifications.map(n => (new Date(n.notify_after)).getTime())
    .reduce((min, t) => {
      return t < now ? min : Math.min(min, t)
    }, nextCheck)
}

function maybeNotify(experiment, lastNotified, nextCheck) {
  const n = selectNotification(experiment.notifications, lastNotified)
  if (n) {
    notify({
      id: n.id,
      title: n.title,
      text: n.text,
      url: experiment.html_url
    })
    return {
      nextCheck: Date.now() + ONE_DAY,
      lastNotified: Date.now()
    }
  }
  return {
    nextCheck: nextCheckTime(experiment.notifications, nextCheck),
    lastNotified: lastNotified
  }
}

module.exports = {
  maybeNotify
}
