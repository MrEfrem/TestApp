//@flow
import React from 'react'
import { withRouter } from 'react-router'
import { createReducer } from 'redux-fly'
import { compose } from 'redux'
import styled from 'styled-components'

let form
const addPost = (e, router, reduxState, reduxSetState, reduxResetState) => {
  e.preventDefault()
  const fieldName = reduxState.fields.name
  if (!reduxState.fields.name.value) {
    reduxSetState('FIELD-NAME-ERROR', (state) => ({
      ...state,
      fields: {
        name: {
          ...state.fields.name,
          error: true
        }
      }
    }))
    return
  }

  const processResultPromise = () => {
    reduxResetState()
    router.push('/')
  }

  fetch('/api/posts/add', {
    method: 'PUT',
    body: JSON.stringify({
      name: fieldName.value
    }),
    headers: {
      'content-type': 'application/json'
    }
  }).then(processResultPromise, processResultPromise)
}

const fieldUpdate = (e, fieldName, reduxSetState) => {
  reduxSetState('FIELD-NAME-UPDATE', (state) => ({
    ...state,
    fields: {
      [fieldName]: { error: false, value: e.target.value }
    }
  }))
}

const InputName = styled.input`
  border: ${props => props.error ? '1px solid red' : 'inherit'};
`

const AddPost = ({ router, reduxSetState, reduxState, reduxResetState }: Object) => (
  <div>
    <h3>Add Post:</h3>
    <form onSubmit={(e) => addPost(e, router, reduxState, reduxSetState, reduxResetState)} ref={ref => form = ref}>
      <label>
        Name:&nbsp;
        <InputName
          type="text"
          name="name"
          value={reduxState.fields.name.value}
          onChange={(e) => fieldUpdate(e, 'name', reduxSetState)}
          error={reduxState.fields.name.error}
        />
      </label>
      &nbsp;
      <button>Add</button>
    </form>
  </div>
)

export default compose(
  withRouter,
  createReducer({
    mountPath: 'addPost',
    initialState: {
      formError: false,
      fields: {
        name: {
          value: '',
          error: false
        }
      }
    }
  })
)(AddPost)
