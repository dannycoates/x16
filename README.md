# X-16

An experiment in addon design using React/Redux.

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

Both the backend and frontend use Redux to manage app state and each have their own copy. In the future the webapp portion (testpilot.firefox.com) would also use Redux. In the meantime  `/backend/lib/webadapter.js` does a 2-way conversion. The `/backend/lib/hub.js` code handles the action routing between ends.

Actions get dispatched on both sides and each side has reducers to update their state. Doing it this way is up for question. Another option is to only dispatch on the backend and have the frontend subscribe to the store to receive state updates. There are tradeoffs with both approaches.

One quirk of using the broadcast action approach is that an actions from the frontends (web or panel) are more like RPC calls to the backend than actions that can just get reduced. Its too early for me to tell if that's bad or not... We could always change it to explicit RPC and have the same effect.

Frontend is mostly a vanilla React/Redux app with the exception of the connection to the backend. Conceptually it could run just as easily on the web, which might make testing and debugging it easier.

### Files of note

- `/backend/lib/webapp.js`
  - Contains the code for communicating with the web page.
  - Connects workers to the hub
- `/backend/lib/webadapter.js`
  - converts between Redux actions and the web page's messages
  - this would go away if the page used actions like frontend
- `/backend/lib/ui.js`
  - contains the addon button and panel elements
  - gets connected to the hub
- `/backend/lib/hub.js`
  - manages communication between backend, frontend, and webend
- `/frontend/lib/backend.js`
  - communicates with the backend
