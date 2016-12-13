//@flow
import React from 'react'
import styled from 'styled-components'
import Menu from './Menu'

const Root = styled.div`
  font-size: 1rem;
  line-height: 1.5rem;
  padding: 20px;
`

const App = ({ children, logged }: Object) => (
  <Root>
    <Menu logged={logged}/>
    {children}
  </Root>
)

export default App
