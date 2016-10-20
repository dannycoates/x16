# X-16

An experiment in addon design using React/Redux.

[![Build Status](https://travis-ci.org/dannycoates/x16.svg?branch=master)](https://travis-ci.org/dannycoates/x16)
[![codecov](https://codecov.io/gh/dannycoates/x16/branch/master/graph/badge.svg)](https://codecov.io/gh/dannycoates/x16)

## Setup

**DO NOT run this addon alongside the TestPilot Addon**

`npm install`

`npm start` will build the addon and post it to the Extension Auto-Installer

## Code Organization

`/backend`

- contains the main addon code.

`/common`

- contains code shared by `/backend` and `/frontend`.

`/data`

- contains the addon's resources.

`/frontend`

- contains the UI inside the addon's panel.

## Design Notes

Both the backend and frontend use [Redux](http://redux.js.org) to manage app state and each have their own copy. In the future the webapp portion (testpilot.firefox.com) would also use Redux. In the meantime  `/backend/lib/webadapter.js` does a 2-way conversion. The `/backend/lib/hub.js` code handles the action routing between ends.

All [actions](http://redux.js.org/docs/basics/Actions.html) are [dispatched](http://redux.js.org/docs/basics/Store.html#dispatching-actions) and [reduced](http://redux.js.org/docs/basics/Reducers.html) by the backend in the same way regardless of the source, backend, frontend, or web. This allows reducers to handle actions from different sources without any special consideration.

Side effects are handled in a similar way to the [Elm Architecture Effects Model](https://guide.elm-lang.org/architecture/effects/). Actions that trigger side effects do so by returning a function from the `sideEffects` reducer. That function gets executed by a store subscriber after the dispatch has completed, keeping the reducers pure. You'll notice that the default return value of the reducer is an empty function which prevents the previous side effect from running again.

Frontend is mostly a vanilla React/Redux app with the exception of the connection to the backend. Conceptually it could run just as easily on the web, which might make testing and debugging it easier.

### Files of note

- `/backend/lib/WebApp.js`
  - Contains the code for communicating with the web page.
  - Connects workers to the hub
- `/backend/lib/middleware/webadapter.js`
  - converts between Redux actions and the web page's messages
  - this would go away if the page used actions like frontend
- `/backend/lib/MainUI.js`
  - contains the addon button and panel elements
  - gets connected to the hub
- `/backend/lib/middleware/Hub.js`
  - manages communication between backend, frontend, and webend
- `/backend/lib/reducers/sideEffects.js`
  - actions trigger side effects here
- `/frontend/lib/backend.js`
  - communicates with the backend
