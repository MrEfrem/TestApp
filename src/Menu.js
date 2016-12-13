//@flow
import React from 'react'
import { Link } from 'react-router'
import styled from 'styled-components'

const Wrapper = styled.div`
  a {
    margin-right: 20px;
  }
`
const Logged = styled.span`
  margin-left: 5rem;
`

const Menu = ({ logged }: Object) => (
  <Wrapper>
    <Link to="/">Posts</Link>
    <Link to="/addPost">Add post</Link>
    <a href="/api/login">Login</a>
    <a href="/api/logout">Logout</a>
    <Logged>Logged: {logged ? 'true' : 'false'}</Logged>
  </Wrapper>
)

export default Menu
