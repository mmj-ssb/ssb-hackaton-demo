import React, { Component } from 'react'
import { Container, Grid, Menu, Message, Segment } from 'semantic-ui-react'
import { Link, Route, Switch } from 'react-router-dom'
import Tags from './components/statistikkbanken/tags/Tags'
import QueryBuilder from './components/statistikkbanken/queryBuilder/QueryBuilder'
import VariableExtractor from './components/statistikkbanken/variableExtractor/VariableExtractor'

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
        <Grid>
          <Grid.Column width={3}>
            <Segment basic>
              <Menu fluid vertical>
                <Menu.Item>
                  <Link to='/datasetList'>
                    Datasetliste
                  </Link>
                </Menu.Item>

                <Menu.Item>
                  <Link to='/queryBuilder'>
                    Spørringsbygger
                  </Link>
                </Menu.Item>

                <Menu.Item>
                  <Link to='/variableExtractor'>
                    Hente variabler
                  </Link>
                </Menu.Item>
              </Menu>
            </Segment>
          </Grid.Column>

          <Grid.Column width={13}>
            <Switch>
              <Route path='/' exact />

              <Route path='/datasetList' exact component={Tags} />

              <Route path='/queryBuilder' exact component={QueryBuilder} />

              <Route path='/variableExtractor' exact component={VariableExtractor} />

              <Route component={notFound} />
            </Switch>
          </Grid.Column>
        </Grid>
      </Container>
    )
  }
}

export default App
