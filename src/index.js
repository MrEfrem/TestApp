// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, compose } from 'redux'
import { Provider } from 'react-redux'
import { enhanceStore } from 'redux-fly'
import routes from './routes'
import { Router, browserHistory } from 'react-router'

const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose

const store = createStore(() => {}, window.__PRELOADED_STATE__, composeEnhancers(enhanceStore))
const target = document.getElementById('root')
const createElement = (Component, props) => {
  return <Component {...props} logged={window.__LOGGED__}/>
}
const render = (routes) => {
  try {
    ReactDOM.render(
      <Provider store={store}>
        <Router history={browserHistory} createElement={createElement}>
          {routes()}
        </Router>
      </Provider>,
      target
    )
  } catch (err) {
    const RedBox = require('redbox-react').default
    ReactDOM.render(<RedBox error={err} />, target)
  }
}

render(routes)

if (module.hot) {
  ((module: Object).hot: Object).accept('./routes', () => {
    setImmediate(() => {
      ReactDOM.unmountComponentAtNode(target)
      render(require('./routes').default)
    })
  })
}

