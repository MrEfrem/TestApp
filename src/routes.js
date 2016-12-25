//@flow
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './App'
import Posts from './Posts'
import AddPost from './AddPost'

export default () => ( // eslint-disable-line
  <Route component={App}>
    <Route path="/">
      <IndexRoute component={Posts}/>
      <Route path="addPost" component={AddPost}/>
    </Route>
  </Route>
)
