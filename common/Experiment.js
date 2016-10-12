/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

/* eslint-disable */

// @flow

function toAbsoluteUrl(baseUrl, path) {
  if (!path) { return '' }
  return path[0] === '/' ? baseUrl + path : path
}

// export class Contributor {
//   display_name: string
//   title: string
//   avatar: string
//
//   constructor (object: Object) {
//     this.display_name = object.display_name
//     this.title = object.title
//     this.avatar = object.avatar
//   }
// }

// export class TourStep {
//   image: string
//   copy: string
//
//   constructor (object: Object) {
//     this.image = object.image
//     this.copy = object.copy
//   }
// }

export class Notification {
  id: number
  title: string
  text: string
  notify_after: string

  constructor (object: Object) {
    this.id = object.id
    this.title = object.title
    this.text = object.text
    this.notify_after = object.notify_after
  }
}

// export class ExperimentDetail {
//   headline: string
//   image: string
//   copy: string
//
//   constructor (object: Object) {
//     this.headline = object.headline
//     this.image = object.image
//     this.copy = object.copy
//   }
// }

export class Experiment {
  baseUrl: string
  id: string
  addon_id: string
  title: string
  // short_title: string
  // slug: string
  thumbnail: string
  // description: string
  // introduction: string
  // image_twitter: string
  // image_facebook: string
  version: string
  // changelog_url: string
  // contribute_url: string
  // bug_report_url: string
  // discourse_url: string
  // privacy_notice_url: string
  // measurements: string
  xpi_url: string
  html_url: string
  survey_url: string
  gradient_start: string
  gradient_stop: string
  // min_release: string
  // pre_feedback_image: string
  // pre_feedback_copy: string
  // details: Array<ExperimentDetail>
  // tour_steps: Array<TourStep>
  notifications: Array<Notification>
  // contributors: Array<Contributor>
  created: string
  modified: string
  completed: string
  order: number
  active: boolean
  installDate: ?Date

  constructor (object: Object, baseUrl?: string) {
    this.baseUrl = object.baseUrl || baseUrl
    this.id = object.addon_id
    this.addon_id = object.addon_id
    this.title = object.title
    // this.short_title = object.short_title
    // this.slug = object.slug
    this.thumbnail = toAbsoluteUrl(this.baseUrl, object.thumbnail)
    // this.description = object.description
    // this.introduction = object.introduction
    // this.image_twitter = toAbsoluteUrl(this.baseUrl, object.image_twitter)
    // this.image_facebook = toAbsoluteUrl(this.baseUrl, object.image_facebook)
    this.version = object.version
    // this.changelog_url = toAbsoluteUrl(this.baseUrl, object.changelog_url)
    // this.contribute_url = toAbsoluteUrl(this.baseUrl, object.contribute_url)
    // this.bug_report_url = toAbsoluteUrl(this.baseUrl, object.bug_report_url)
    // this.discourse_url = toAbsoluteUrl(this.baseUrl, object.discourse_url)
    // this.privacy_notice_url = toAbsoluteUrl(this.baseUrl, object.privacy_notice_url)
    // this.measurements = object.measurements
    this.xpi_url = toAbsoluteUrl(this.baseUrl, object.xpi_url)
    this.html_url = toAbsoluteUrl(this.baseUrl, object.html_url)
    this.survey_url = toAbsoluteUrl(this.baseUrl, object.survey_url)
    this.gradient_start = object.gradient_start
    this.gradient_stop = object.gradient_stop
    // this.min_release = object.min_release
    // this.pre_feedback_image = object.pre_feedback_image
    // this.pre_feedback_copy = object.pre_feedback_copy
    // this.details = object.details
    // this.tour_steps = object.tour_steps
    this.notifications = Array.isArray(object.notifications) ?
      object.notifications.map(o => new Notification(o)) :
      []
    // this.contributors = object.contributors
    this.created = object.created
    this.modified = object.modified
    this.completed = object.completed
    this.order = object.order

    this.active = object.active || false
    this.installDate = object.installDate
  }

  toJSON () {
    return {
      // id: this.id,
      addon_id: this.addon_id,
      title: this.title,
      // short_title: this.short_title,
      // slug: this.slug,
      thumbnail: this.thumbnail,
      // description: this.description,
      // introduction: this.introduction,
      // image_twitter: this.image_twitter,
      // image_facebook: this.image_facebook,
      // version: this.version,
      // changelog_url: this.changelog_url,
      // contribute_url: this.contribute_url,
      // bug_report_url: this.bug_report_url,
      // discourse_url: this.discourse_url,
      // privacy_notice_url: this.privacy_notice_url,
      // measurements: this.measurements,
      // xpi_url: this.xpi_url,
      html_url: this.html_url,
      // survey_url: this.survey_url,
      gradient_start: this.gradient_start,
      gradient_stop: this.gradient_stop,
      // min_release: this.min_release,
      // pre_feedback_image: this.pre_feedback_image,
      // pre_feedback_copy: this.pre_feedback_copy,
      // details: this.details,
      // tour_steps: this.tour_steps,
      // notifications: this.notifications,
      // contributors: this.contributors,
      created: this.created,
      modified: this.modified,
      completed: this.completed,
      order: this.order,
      active: this.active,
      installDate: this.installDate
    }
  }
}

export type Experiments = {
  [id: string]: Experiment
}
