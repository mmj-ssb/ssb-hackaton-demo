import React, { Component } from 'react'
import { Container, Grid, Menu, Message, Segment } from 'semantic-ui-react'
import { Link, Route, Switch } from 'react-router-dom'
import StatistikkbankenTags from './components/tags/StatistikkbankenTags'
import Article from './components/artikkel/Article'

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
                    Datasetliste fra SB
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to='/artikkel'>
                    Artikler
                  </Link>
                </Menu.Item>
              </Menu>
            </Segment>
          </Grid.Column>

          <Grid.Column width={13}>
            <Switch>
              <Route path='/' exact />

              <Route path='/datasetList' exact component={StatistikkbankenTags} />
              <Route path='/artikkel' exact component={Article} />
              <Route component={notFound} />
            </Switch>
          </Grid.Column>
        </Grid>
      </Container>
    )
  }
}

export default App
