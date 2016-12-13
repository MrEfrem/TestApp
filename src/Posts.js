// @flow
import React, { PropTypes } from 'react'
import { createReducer } from 'redux-fly'

class Posts extends React.Component {
  static propTypes = {
    reduxState: PropTypes.object.isRequired,
    reduxSetState: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { reduxSetState } = this.props
    fetch('/api/posts')
      .then(response => response.json())
      .then(response => reduxSetState('POSTS-LOADED', { posts: response }))
  }

  render() {
    const { posts } = this.props.reduxState
    return (
      <div>
        <h3>Posts:</h3>
        <ul>
          {posts.map((post, key) =>
            <li key={key}>
              Name: {post.name}<br/>
              Added: {post.date}
            </li>
          )}
        </ul>
      </div>
    )
  }
}

export default createReducer({
  mountPath: 'posts',
  initialState: {
    posts: []
  }
})(Posts)
