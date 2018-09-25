import React from 'react'
import axios from 'axios'
import { Button, Container, Divider, Header, Input, List, Segment } from 'semantic-ui-react'

const apiUrl = 'https://data.ssb.no/api/v0/no/table/'

class VariableExtractor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ready: false,
      error: '',
      table: '',
      title: '',
      variables: [],
      variablesMajor: [],
      variablesMinor: []
    }
  }

  upperCaseFirst = (string) => {
    return string.toString().charAt(0).toUpperCase() + string.slice(1)
  }

  handleInputChange = (event) => {
    this.setState({table: event.target.value})
  }

  handleExtractVariables = () => {
    if (this.state.table.length === 5) {
      const url = apiUrl + this.state.table

      axios.get(url).then(response => {
        this.setState({
          variables: response.data.variables,
          title: response.data.title
        }, () => {
          const majorVariables = []
          const minorVariables = []

          for (let i = 0, l = this.state.variables.length; i < l; i++) {
            const text = this.state.variables[i].text

            majorVariables.push(text.toLowerCase())

            for (let ii = 0, ll = this.state.variables[i].valueTexts.length; ii < ll; ii++) {
              const valueText = this.state.variables[i].valueTexts[ii]

              minorVariables.push(valueText.toLowerCase())
            }
          }

          this.setState({
            ready: true,
            error: '',
            variablesMajor: majorVariables,
            variablesMinor: minorVariables
          })
        })
      }).catch(error => {
        console.log(error)

        const errorMessage = error.message + ' (sjekk console)'

        this.setState({error: errorMessage})
      })
    } else {
      this.setState({
        error: 'Godtar bare 5 siffer'
      })
    }
  }

  handleCheckState = () => {
    console.log(this.state)
  }

  render () {
    const {ready, error, table, title, variables} = this.state

    return (
      <Segment basic>
        <Input label='Tabellnummer' placeholder='Tabellnummer' name='table' value={table}
               onChange={this.handleInputChange}
               action={{
                 icon: 'arrow alternate circle down',
                 color: 'teal',
                 onClick: this.handleExtractVariables,
                 content: 'Hent variabler'
               }}
        />

        <Divider fitted hidden />

        {error && <span style={{color: '#db2828'}}>{error}</span>}

        <Divider hidden />

        {ready &&
        <Container>
          <Header as='h4' content={title} />

          <List>
            {Object.keys(variables).map((item, index) => {
              let text = ''

              return (
                <List.Item key={index}>
                  <List.Header>{this.upperCaseFirst(variables[index].text)}</List.Header>

                  {Object.keys(variables[index].valueTexts).map((innerItem, innerIndex) => {
                    text = text + ', ' + variables[index].valueTexts[innerIndex]

                    return null
                  })}

                  {text.slice(1)}
                </List.Item>
              )
            })}
          </List>
        </Container>
        }

        <Divider hidden />

        <Button color='pink' content='Sjekk state' onClick={this.handleCheckState} />
      </Segment>
    )
  }
}

export default VariableExtractor
