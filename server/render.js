import { enhanceStore } from 'redux-fly'
import { createStore } from 'redux'
import fs from 'fs'
import React from 'react'
import ReactDOM from 'react-dom/server'
import serialize from 'serialize-javascript'
import { Provider } from 'react-redux'
import styleSheet from 'styled-components/lib/models/StyleSheet'
import { match, RouterContext } from 'react-router'
import config from '../config'

const getTemplate = (markup, preloadedState, styles, logged) => {
  const pathTemplate = process.env.NODE_ENV === 'production'
    ? config.path.buildTemplate
    : config.path.rawTemplate
  let template = fs.readFileSync(pathTemplate, 'utf-8')
  template = template.replace('<style></style>', `<style>${styles}</style>`)
  const replaces = [
    `<div id="root">${markup}</div>`,
    `<script>window.__PRELOADED_STATE__=${serialize(preloadedState)};var __LOGGED__=${Boolean(logged)};</script>`,
  ]
  if (process.env.NODE_ENV === 'development') {
    replaces.push(
      `<script src="${config.webpack.publicPath}${config.webpack.fileName}?nocache=${Math.random()}"></script>`
    )
    return template
      .replace(
        '<div id="root"></div>', replaces.join('')
      )
      .replace(/%PUBLIC_URL%/g, config.publicUrl)
  }
  return template
    .replace(
      '<div id="root"></div>', replaces.join('')
    )
}

export default function* () { // eslint-disable-line
  // Create a new Redux store instance
  const store = createStore(() => {}, null, enhanceStore)

  // Delete the Routes component cache for live editing
  if (process.env.NODE_ENV === 'development') {
    delete require.cache[require.resolve('../src/Routes')]
  }
  // Set PUBLIC_URL for access from React components
  process.env.PUBLIC_URL = config.publicUrl

  // Require Routes component from disk
  const routes = require('../src/routes').default

  const logged = Boolean(this.session.logged)

  // Match routes
  match({ routes: routes(), location: this.request.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      this.throw('Internal server error')
    } else if (redirectLocation) {
      this.redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      // Render the component to a string
      const createElement = (Component, props) => {
        return <Component {...props} logged={logged}/>
      }
      const markup = ReactDOM.renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} createElement={createElement} />
        </Provider>
      )
      const styles = styleSheet.rules().map(rule => rule.cssText).join('\n')

      // Grab the initial state from our Redux store
      const finalState = store.getState()

      // Send the rendered page back to the client
      this.body = getTemplate(markup, finalState, styles, logged)
    } else {
      this.status = 404
    }
  })
}
