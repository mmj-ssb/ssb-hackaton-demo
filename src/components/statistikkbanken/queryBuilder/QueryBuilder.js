import React from 'react'
import axios from 'axios'
import { Accordion, Button, Divider, Segment } from 'semantic-ui-react'

const apiUrl = 'https://data.ssb.no/api/v0/no/table/'

class QueryBuilder extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ready: false,
      subjects: [],
      query: {
        query: [{
          code: '',
          selection: {
            filter: '',
            values: []

          }
        }],
        response: {
          format: 'json-stat'
        }
      },
      response: {},
      rootPanels: []
    }
  }

  componentDidMount () {
    axios.get(apiUrl).then(response => {
      this.setState({subjects: response.data}, () => {
        const rootPanels = []

        for (let i = 0, l = this.state.subjects.length; i < l; i++) {
          let panelObject = {
            key: this.state.subjects[i].id,
            title: this.state.subjects[i].text,
            content: {content: this.createRootPanelContent(this.state.subjects[i].id)}
          }

          rootPanels.push(panelObject)
        }

        this.setState({rootPanels: rootPanels, ready: true})
      })

    }).catch(error => {
      console.log(error)
    })
  }

  runQuery = (table) => {
    const url = apiUrl + table

    axios.post(url, this.state.query, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      this.setState({response: response.data})
      console.log(response)
    }).catch(error => {
      console.log(error)
    })
  }

  getSubSubjects = (subject) => {
    const url = apiUrl + subject

    axios.get(url).then(response => {
      console.log(response.data)
    }).catch(error => {
      console.log(error)
    })
  }

  createAccordion = () => {
    return (
      <Accordion defaultActiveIndex={-1} panels={this.state.rootPanels} styled />
    )
  }

  createRootPanelContent = (id) => {
    return (
      <Button primary onClick={(event, {subject = id}) => this.getSubSubjects(subject)} content='Hent underemner' />
    )
  }

  handleCheckState = () => {
    console.log(this.state)
  }

  render () {
    const {ready} = this.state

    return (
      <Segment basic>
        {ready && this.createAccordion()}

        <Divider hidden />

        <Button color='pink' content='Sjekk state' onClick={this.handleCheckState} />
      </Segment>
    )
  }
}

export default QueryBuilder
