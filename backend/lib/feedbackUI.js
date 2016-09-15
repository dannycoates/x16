/*
 *   This Source Code is subject to the terms of the Mozilla Public License
 *   version 2.0 (the 'License'). You can obtain a copy of the License at
 *   http://mozilla.org/MPL/2.0/.
 */

/*
 *   Originally Liberated from
 *   https://github.com/lmorchard/fireriver/blob/master/lib/main.js#L369
 *   & https://dxr.mozilla.org/mozilla-central/source/browser/components/uitour/UITour.jsm
 */

const { Services } = require('resource://gre/modules/Services.jsm')
const { setTimeout, clearTimeout } = require('sdk/timers')

function getAnonEl (win, box, attrName) {
  return win.document.getAnonymousElementByAttribute(box, 'anonid', attrName)
}

function createRatingUI (win, cb) {
  // Create the fragment holding the rating UI.
  const frag = win.document.createDocumentFragment()

  // Build the star rating.
  const ratingContainer = win.document.createElement('hbox')
  ratingContainer.id = 'star-rating-container'
  ratingContainer.setAttribute('style', 'margin-bottom: 2px')

  function ratingListener (evt) {
    cb(Number(evt.target.getAttribute('data-score'), 10))
  }

  for (let starIndex = 5; starIndex > 0; starIndex--) {
    // Create a star rating element.
    const ratingElement = win.document.createElement('toolbarbutton')

    // Style it.
    ratingElement.className = 'plain star-x'
    ratingElement.id = 'star' + starIndex
    ratingElement.setAttribute('data-score', starIndex)

    // Add the click handler.
    ratingElement.addEventListener('click', ratingListener)

    // Add it to the container.
    ratingContainer.appendChild(ratingElement)
  }

  frag.appendChild(ratingContainer)

  return frag
}

function createNotificationBox (options) {
  const win = Services.wm.getMostRecentWindow('navigator:browser')
  const notifyBox = win.gBrowser.getNotificationBox()
  const box = notifyBox.appendNotification(
    options.label,
    options.value || '',
    options.image,
    notifyBox.PRIORITY_INFO_LOW,
    options.buttons || [],
    options.callback
  )
  const messageText = getAnonEl(win, box, 'messageText')
  const messageImage = getAnonEl(win, box, 'messageImage')

  if (options.child) {
    const child = options.child(win)
    // Make sure the child is not pushed to the right by the spacer.
    const rightSpacer = win.document.createElement('spacer')
    rightSpacer.flex = 20
    child.appendChild(rightSpacer)
    box.appendChild(child)
  }
  messageText.flex = 0 // Collapse the space before the stars/button.
  const leftSpacer = messageText.nextSibling
  leftSpacer.flex = 0
  box.classList.add('heartbeat')
  messageImage.classList.add('heartbeat')
  if (options.pulse) {
    messageImage.classList.add('pulse-onshow')
  }
  messageText.classList.add('heartbeat')
  messageImage.setAttribute('style', 'filter: invert(80%)')
  box.persistence = options.persistence || 0
  return {
    notifyBox,
    box
  }
}

function showRating (options) {
  return new Promise((resolve, reject) => {
    const experiment = options.experiment
    const uiTimeout = setTimeout(uiClosed, options.duration || 60000)
    let experimentRating = null

    const { notifyBox, box } = createNotificationBox({
      label: `Please rate ${experiment.title}`,
      image: experiment.thumbnail,
      child: win => createRatingUI(win, uiClosed),
      persistence: options.persistence,
      pulse: true,
      callback: () => {
        clearTimeout(uiTimeout)
        experimentRating ? resolve(experimentRating) : reject()
      }
    })

    function uiClosed (rating) {
      experimentRating = rating
      notifyBox.removeNotification(box)
    }
  })
}

function showSurveyButton (options) {
  return new Promise((resolve, reject) => {
    let clicked = false
    const { experiment, duration } = options

    const { notifyBox, box } = createNotificationBox({
      label: `Thank you for rating ${experiment.title}.`,
      image: experiment.thumbnail,
      buttons: [{
        label: 'Take a Quick Survey',
        callback: () => { clicked = true }
      }],
      callback: () => {
        clearTimeout(uiTimeout)
        clicked ? resolve() : reject()
      }
    })
    const uiTimeout = setTimeout(() => { notifyBox.removeNotification(box) }, duration || 60000)
    const button = box.getElementsByClassName('notification-button')[0]
    if (!button) {
      return reject('missing feedback button')
    }
    button.setAttribute('style', 'background: #0095dd; color: #fff; height: 30px; font-size: 13px; border-radius: 2px; border: 0px; text-shadow: 0 0px; box-shadow: 0 0px;')
  })
}

module.exports = {
  showRating,
  showSurveyButton
}
