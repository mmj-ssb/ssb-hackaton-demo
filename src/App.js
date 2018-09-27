import React, { Component } from 'react'
import { Route, Router } from 'react-router-dom'
import { Container, Grid, Menu, Message, Segment } from 'semantic-ui-react'
import WelcomePage from "./components/WelcomePage";
import { history } from './components/history'
import Memphisto from "./components/Memphisto";

const notFound = ({location}) => {
  const content = '\'' + location.pathname + '\' finnes ikke'

  return (
    <Segment basic>
      <Message error icon='warning' header={'Finner ikke'} content={content} />
    </Segment>
  )
}

class App extends Component {
  render () {
    return (
      <Container fluid>
        <Router history={history}>
        <Grid>
          <Grid.Column width={16}>
            <Route path='/memphisto' exact component={Memphisto} />
            <Route path='/' exact component={WelcomePage} />
          </Grid.Column>
        </Grid>
        </Router>
      </Container>
    )
  }
}

export default App
