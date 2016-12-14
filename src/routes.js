//@flow
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './App'

if (process.env.NODE_ENV === 'development' || typeof require.ensure === 'undefined') require.ensure = (undefined, fc) => fc(require)

export default () => ( // eslint-disable-line
  <Route component={App}>
    <Route path="/">
      <IndexRoute
        getComponent={
          (location, callback) => {
            require.ensure([], (require) => {
              callback(null, require('./Posts').default)
            })
          }
        }
      />
      <Route path="addPost"
        getComponent={
          (location, callback) => {
            require.ensure([], (require) => {
              callback(null, require('./AddPost').default)
            })
          }
        }
      />
    </Route>
  </Route>
)
