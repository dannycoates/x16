const types = {
  experiment: {
    'id': 5,
    'title': 'Min Vid',
    'short_title': '',
    'slug': 'min-vid',
    'thumbnail': 'http://testpilot.dev:8000/static/images/experiments/min-vid/experiments_experiment/thumbnail.png',
    'description': 'Keep videos front and center. Min Vid lets you display YouTube and Vimeo videos in a small frame that stays in the foreground as you browse the web.',
    'introduction': '<p>Love watching video? Love getting things done while you watch video? Try Min Vid. It’s like picture-in-picture where one picture is a video and the other is the entire Web.</p><ul><li><strong>Click and go:</strong> Pop up the Min Vid frame to keep videos playing in the foreground while you browse.</li><li><strong>Put it where you want it:</strong> Min Vid lets you drag the video frame anywhere in the browser window.</li><li><strong>Controls where you need them:</strong> Min Vid includes controls to let you pause/play, scrub, and adjust volume right in the frame.</li></ul>',
    'image_twitter': 'http://testpilot.dev:8000/static/images/experiments/min-vid/social/mv-twitter.jpg',
    'image_facebook': 'http://testpilot.dev:8000/static/images/experiments/min-vid/social/mv-facebook.jpg',
    'version': '0.3.0',
    'changelog_url': 'https://github.com/meandavejustice/min-vid',
    'contribute_url': 'https://github.com/meandavejustice/min-vid',
    'bug_report_url': 'https://github.com/meandavejustice/min-vid/issues',
    'discourse_url': 'https://discourse.mozilla-community.org/c/test-pilot/min-vid',
    'privacy_notice_url': 'https://github.com/meandavejustice/min-vid/blob/master/docs/metrics.md',
    'measurements': '<p>In addition to the <a href=\'/privacy\'>data</a> collected by all Test Pilot experiments, here are the key things you should know about what is happening when you use Min Vid:</p>\n<ul>\n<li>We collect usage data when you engage with the context menu, experiment icon and player controls.</li>\n<li>We also collect data on the number of times you encounter a playable video, the number of times you played the video and the video service that provided the video. This helps us understand how useful our users are finding the experiment.</li>\n<li>We do not collect information about the specific videos you encounter.</li>\n</ul>',
    'xpi_url': 'https://testpilot.firefox.com/files/min-vid/min-vid-0.3.0-fx.xpi',
    'addon_id': '@min-vid',
    'gradient_start': '#FED66F',
    'gradient_stop': '#FD667B',
    'details': [
      {
        'headline': ' ',
        'image': 'http://testpilot.dev:8000/static/images/experiments/min-vid/experiments_experimentdetail/detail1.jpg',
        'copy': 'Access Min Vid from YouTube and Vimeo video players.'
      },
      {
        'headline': ' ',
        'image': 'http://testpilot.dev:8000/static/images/experiments/min-vid/experiments_experimentdetail/detail2.jpg',
        'copy': 'Watch video in the foreground while you do other things on the Web.'
      },
      {
        'headline': ' ',
        'image': 'http://testpilot.dev:8000/static/images/experiments/min-vid/experiments_experimentdetail/detail3.jpg',
        'copy': 'Right click on links to video to find Min Vid in the in-context controls.'
      }
    ],
    'tour_steps': [
      {
        'image': 'http://testpilot.dev:8000/static/images/experiments/min-vid/experiments_experimenttourstep/tour1.jpg',
        'copy': '<p>Select the icon to start using Min Vid.'
      },
      {
        'image': 'http://testpilot.dev:8000/static/images/experiments/min-vid/experiments_experimenttourstep/tour2.jpg',
        'copy': '<p>Play video in the foreground while you continue to browse.</p>'
      },
      {
        'image': 'http://testpilot.dev:8000/static/images/experiments/min-vid/experiments_experimenttourstep/tour3.jpg',
        'copy': 'Access controls in the frame to adjust volume, play, pause and move the video.</p>'
      },
      {
        'image': 'http://testpilot.dev:8000/static/images/experiments/min-vid/experiments_experimenttourstep/tour4.jpg',
        'copy': '<p>You can always give us feedback or disable Min Vid from Test Pilot.</p>'
      }
    ],
    'notifications': [],
    'contributors': [
      {
        'display_name': 'Dave Justice',
        'title': 'Engineer',
        'avatar': 'http://testpilot.dev:8000/static/images/experiments/avatars/dave-justice.jpg'
      },
      {
        'display_name': 'Jared Hirsch',
        'title': 'Staff Engineer',
        'avatar': 'http://testpilot.dev:8000/static/images/experiments/avatars/jared-hirsch.jpg'
      },
      {
        'display_name': 'Jen Kagan',
        'title': 'Engineering Intern',
        'avatar': 'http://testpilot.dev:8000/static/images/experiments/avatars/jen-kagan.jpg'
      }
    ],
    'created': '2016-09-22T00:07:28.847430Z',
    'modified': '2016-09-22T16:51:12.188781Z',
    'order': 1,
    'url': 'http://testpilot.dev:8000/api/experiments/5.json',
    'html_url': 'http://testpilot.dev:8000/experiments/min-vid',
    'installations_url': 'http://testpilot.dev:8000/api/experiments/5/installations/',
    'survey_url': 'https://qsurvey.mozilla.com/s3/min-vid'
  },
  install: {
    addon_id: '@min-vid',
    error: 0,
    state: 1,
    progress: 100,
    maxProgress: 100
  },
  env: 'any',
  baseUrl: 'http://testpilot.dev:8000',
  experiments: [],
  text: 'yo!',
  time: Date.now(),
  nextCheck: Date.now(),
  lastNotified: Date.now(),
  rating: 5,
  interval: 2
}

export default function templates (arg) {
  return types[arg] || null
}
